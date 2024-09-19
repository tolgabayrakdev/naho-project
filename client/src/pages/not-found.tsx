import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
    return (
        <Box textAlign="center" py={10} px={6}>
            <VStack spacing={8}>
                <Heading
                    display="inline-block"
                    as="h2"
                    size="2xl"
                    bgGradient="linear(to-r, blue.400, blue.400)"
                    backgroundClip="text"
                >
                    404
                </Heading>
                <Text fontSize="18px" mt={3} mb={2}>
                    Sayfa Bulunamadı
                </Text>
                <Text color={'gray.500'} mb={6}>
                    Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                </Text>

                <Button
                    colorScheme="blue"
                    color="white"
                    variant="solid"
                    as={RouterLink}
                    to="/"
                >
                    Ana Sayfaya Dön
                </Button>
            </VStack>
        </Box>
    );
};

export default NotFound;