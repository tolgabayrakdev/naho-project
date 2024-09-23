import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  Text,
} from '@chakra-ui/react';

type FeedbackPage = {
  id: string;
  companyName: string;
  token: string;
};

export default function FeedbackForm() {
  const { token } = useParams<{ token: string }>();
  const [page, setPage] = useState<FeedbackPage | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Burada normalde API'den sayfa bilgilerini çekeceksiniz
    // Şimdilik mock data kullanıyoruz
    const mockPage: FeedbackPage = {
      id: '1',
      companyName: 'ABC Şirketi',
      token: token || '',
    };
    setPage(mockPage);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Burada normalde API'ye form verilerini göndereceksiniz
    // Şimdilik sadece simüle ediyoruz
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Geri bildirim gönderildi.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setName('');
    setEmail('');
    setMessage('');
    setIsLoading(false);
  };

  if (!page) {
    return <Text>Yükleniyor...</Text>;
  }

  return (
    <Box maxWidth="500px" margin="auto" mt={8} p={4}>
      <Heading mb={6}>{page.companyName} Geri Bildirim Formu</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>İsim</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>E-posta</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Mesajınız</FormLabel>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Gönderiliyor..."
          >
            Gönder
          </Button>
        </VStack>
      </form>
    </Box>
  );
}