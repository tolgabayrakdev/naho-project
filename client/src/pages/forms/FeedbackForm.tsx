import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  Select,
  Button,
  useToast,
  Center,
} from '@chakra-ui/react';

type FeedbackPage = {
  id: string;
  title: string;
  description: string;
  url_token: string;
  expires_at: string;
  username: string;
  email: string;
};

const getFeedbackTypeColor = (type: string) => {
  switch (type) {
    case 'şikayet':
      return 'red.500';
    case 'öneri':
      return 'orange.500';
    case 'istek':
      return 'blue.500';
    case 'tebrik':
      return 'green.500';
    default:
      return 'gray.500';
  }
};

export default function FeedbackForm() {
  const { token } = useParams<{ token: string }>();
  const [feedbackPage, setFeedbackPage] = useState<FeedbackPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [feedbackType, setFeedbackType] = useState('tebrik');
  const toast = useToast();

  useEffect(() => {
    const fetchFeedbackPage = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/feedback-page/${token}`, {
          method: "GET",
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error('Geri bildirim sayfası bulunamadı.');
        }
        const data = await response.json();
        setFeedbackPage(data);
      } catch (error) {
        setError("Geri bildirim sayfası bulunamadı.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbackPage();
  }, [token]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/feedback-page/${token}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ email, content, feedback_type: feedbackType }),
      });
      if (!response.ok) {
        throw new Error('Geri bildirim gönderilemedi.');
      }
      toast({
        title: "Geri bildiriminiz gönderildi.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setEmail('');
      setContent('');
      setFeedbackType('tebrik');
    } catch (error) {
      toast({
        title: "Geri bildiriminiz gönderilemedi.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Center>
      <Box p={5} maxWidth="600px" width="100%">
        <Heading size="lg" textAlign="center">{feedbackPage?.title}</Heading>
        <Text mt={4} textAlign="center">{feedbackPage?.description}</Text>
        <Text mt={4} textAlign="center">Oluşturan: {feedbackPage?.username} ({feedbackPage?.email})</Text>
        <Text mt={4} textAlign="center">Bitiş Tarihi: {feedbackPage?.expires_at}</Text>

        <Box mt={8}>
          <Heading size="md" textAlign="center">Geri Bildirim Formu</Heading>
          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>İçerik</FormLabel>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Bildirim Tipi</FormLabel>
            <Select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
            >
              <option value="tebrik">Tebrik</option>
              <option value="öneri">Öneri</option>
              <option value="şikayet">Şikayet</option>
              <option value="istek">İstek</option>
            </Select>
          </FormControl>
          <Button
            mt={4}
            colorScheme="blue"
            onClick={handleSubmit}
            width="100%"
            _hover={getFeedbackTypeColor(feedbackType)}
            bg={getFeedbackTypeColor(feedbackType)}
          >
            Gönder
          </Button>
        </Box>
      </Box>
    </Center>
  );
}