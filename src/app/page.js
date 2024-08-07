'use client';

import { useState, useEffect } from 'react';
import { firestore } from './firebase'; // Adjust the path if needed
import { Box, Typography, Stack, Button, TextField, Modal, Paper } from '@mui/material';
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const q = query(collection(firestore, 'inventory'));
    const snapshot = await getDocs(q);
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (name, quantity) => {
    if (!name || quantity <= 0) return; // Check for empty item name or invalid quantity
    const docRef = doc(collection(firestore, 'inventory'), name);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await setDoc(docRef, { name: name, quantity: docSnap.data().quantity + quantity });
    } else {
      await setDoc(docRef, { name: name, quantity: quantity });
    }
    await updateInventory();
  };

  const incrementItem = async (name) => {
    const docRef = doc(collection(firestore, 'inventory'), name);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await setDoc(docRef, { name: name, quantity: docSnap.data().quantity + 1 });
    }
    await updateInventory();
  };

  const decrementItem = async (name) => {
    const docRef = doc(collection(firestore, 'inventory'), name);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { name: name, quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const removeItem = async (name) => {
    const docRef = doc(collection(firestore, 'inventory'), name);
    await deleteDoc(docRef);
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => {
    setItemName('');
    setItemQuantity(1);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      sx={{
        backgroundImage: 'url(/hadi.png)', // Reference image in the public directory
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: { xs: 2, sm: 3 },
        overflow: 'hidden', // Ensures that content is cropped
      }}
    >
      <Box
        width={{ xs: '100%', md: '60%' }}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        padding={2}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 2,
          marginTop: 2,
          marginLeft: { xs: 0, md: '-20px' },
          overflow: 'hidden', // Ensure content is clipped
        }}
      >
        <Typography variant="h4" color="#333" marginBottom={2}>
          Your Pantry Items
        </Typography>
        <Box display="flex" width="100%" marginBottom={2}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, marginRight: 2 }}
          />
          <Button variant="contained" onClick={handleOpen}>
            Add New Item
          </Button>
        </Box>
        <Paper elevation={3} sx={{ width: '100%', padding: 2, borderRadius: 2, maxHeight: '70vh', overflowY: 'auto' }}>
          <Stack spacing={2} padding={2}>
            {filteredInventory.map(({ id, name, quantity }) => (
              <Box
                key={id}
                width="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#f0f0f0"
                padding={2}
                borderRadius={2}
                boxShadow={2}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <Typography variant="h6" color="#333" flex="1">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h6" color="#333" width="120px" textAlign="right">
                    Quantity: {quantity}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} marginLeft={2}>
                    <Button variant="outlined" onClick={() => incrementItem(name)}>+</Button>
                    <Button variant="outlined" onClick={() => decrementItem(name)}>-</Button>
                  </Box>
                  <Box marginLeft={2}>
                    <Button variant="contained" color="error" onClick={() => removeItem(name)}>
                      Remove
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '80%', sm: 400 },
          bgcolor: 'background.paper',
          border: 'none',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={2}>
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2} marginBottom={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-quantity"
              label="Quantity"
              variant="outlined"
              type="number"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Number(e.target.value))}
            />
          </Stack>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              addItem(itemName, itemQuantity);
              setItemName('');
              setItemQuantity(1);
              handleClose();
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
