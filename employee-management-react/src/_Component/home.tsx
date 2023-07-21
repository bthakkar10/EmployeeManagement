import { Box, Typography } from '@mui/material';
import Container from '@mui/material/Container/Container';
import React from 'react';

function Home() {
    return (
        <Container maxWidth="md">
            <Box mt={6} py={5}>
                <Typography variant="h2" align="center" margin="dense">
                    Hii! Welcome here!!
                </Typography>
            </Box>
        </Container>
    );
};

export default Home;