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
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';

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
    case 'complaint':
      return 'red.500';
    case 'suggestion':
      return 'orange.500';
    case 'request':
      return 'blue.500';
    case 'compliment':
      return 'green.500';
    default:
      return 'gray.500';
  }
};

const feedbackTypeMap: { [key: string]: string } = {
  'şikayet': 'complaint',
  'öneri': 'suggestion',
  'istek': 'request',
  'tebrik': 'compliment'
};

export default function FeedbackForm() {
  const { token } = useParams<{ token: string }>();
  const [feedbackPage, setFeedbackPage] = useState<FeedbackPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [feedbackType, setFeedbackType] = useState('compliment');
  const [feedbackPageId, setFeedbackPageId] = useState<number | null>(null);
  const toast = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        setFeedbackPageId(data.id);
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
      const response = await fetch(`http://localhost:8000/api/user-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ 
          customer_email: email, 
          content, 
          feedback_type: feedbackTypeMap[feedbackType] || feedbackType, 
          feedback_page_id: feedbackPageId 
        }),
      });
      if (!response.ok) {
        throw new Error('Geri bildirim gönderilemedi.');
      }
      setIsSubmitted(true);
      toast({
        title: "Geri bildiriminiz gönderildi.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
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

  const formattedExpiresAt = feedbackPage ? format(new Date(feedbackPage.expires_at), 'yyyy-MM-dd HH:mm') : '';

  return (
    <Box
      minHeight="100vh"
      bgImage="url('https://plus.unsplash.com/premium_photo-1667354154657-5adc088ed55a?q=80&w=2372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
      bgSize="cover"
      bgPosition="center"
      p={5}
    >
      <Center>
        <Box
          p={8}
          maxWidth="600px"
          width="100%"
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow="lg"
          borderRadius="lg"
          opacity="0.95"
        >
          {isSubmitted ? (
            <VStack spacing={4} align="stretch">
              <Heading size="lg" textAlign="center" color={useColorModeValue('teal.600', 'teal.300')}>
                Geri Bildiriminiz Alındı
              </Heading>
              <Text textAlign="center">
                Değerli geri bildiriminiz için teşekkür ederiz. Katkınız bizim için çok önemli.
              </Text>
            </VStack>
          ) : (
            <>
              <Heading size="lg" textAlign="center" color={useColorModeValue('teal.600', 'teal.300')}>
                {feedbackPage?.title}
              </Heading>
              <Text mt={4} textAlign="center" color={useColorModeValue('gray.600', 'gray.400')}>
                {feedbackPage?.description}
              </Text>
              <Text mt={4} textAlign="center" color={useColorModeValue('gray.600', 'gray.400')}>
                Oluşturan: {feedbackPage?.username} ({feedbackPage?.email})
              </Text>
              <Text mt={4} textAlign="center" color={useColorModeValue('gray.600', 'gray.400')}>
                Bitiş Tarihi: {formattedExpiresAt}
              </Text>

              <Box mt={8}>
                <Heading size="md" textAlign="center" color={useColorModeValue('teal.600', 'teal.300')}>
                  Geri Bildirim Formu
                </Heading>
                <FormControl mt={4}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    focusBorderColor='teal.500'
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>İçerik</FormLabel>
                  <Textarea
                    focusBorderColor='teal.500'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Bildirim Tipi</FormLabel>
                  <Select
                    focusBorderColor='gray.100'
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                    color={getFeedbackTypeColor(feedbackTypeMap[feedbackType] || feedbackType)}
                  >
                    <option value="tebrik" style={{ color: getFeedbackTypeColor('appreciation') }}>Tebrik</option>
                    <option value="öneri" style={{ color: getFeedbackTypeColor('suggestion') }}>Öneri</option>
                    <option value="şikayet" style={{ color: getFeedbackTypeColor('complaint') }}>Şikayet</option>
                    <option value="istek" style={{ color: getFeedbackTypeColor('request') }}>İstek</option>
                  </Select>
                </FormControl>
                <Button
                  mt={4}
                  colorScheme="teal"
                  onClick={handleSubmit}
                  width="100%"
                  bg={getFeedbackTypeColor(feedbackTypeMap[feedbackType] || feedbackType)}
                  _hover={{ bg: getFeedbackTypeColor(feedbackTypeMap[feedbackType] || feedbackType) }}
                >
                  Gönder
                </Button>
                <Text mt={4} textAlign="center" fontSize="small">
                  Naho tarafından oluşturuldu.
                </Text>
              </Box>
            </>
          )}
        </Box>
      </Center>
    </Box>
  );
}