import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  Select,
  Button,
  useToast,
  useColorModeValue,
  VStack,
  FormErrorMessage,
  Flex,
  Container,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Loading from '../../components/loading';

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

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Geçerli bir email adresi giriniz')
    .required('Email gereklidir'),
  content: Yup.string()
    .min(10, 'İçerik en az 10 karakter olmalıdır')
    .required('İçerik gereklidir'),
  feedbackType: Yup.string().required('Bildirim tipi seçiniz'),
});

export default function FeedbackForm() {
  const { token } = useParams<{ token: string }>();
  const [feedbackPage, setFeedbackPage] = useState<FeedbackPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await fetch(`http://localhost:8000/api/user-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          customer_email: values.email,
          content: values.content,
          feedback_type: feedbackTypeMap[values.feedbackType] || values.feedbackType,
          feedback_page_id: feedbackPage?.id
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
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Flex minHeight="100vh" alignItems="center" justifyContent="center" bg={useColorModeValue('gray.50', 'gray.900')}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Flex>
    );
  }

  const formattedExpiresAt = feedbackPage ? format(new Date(feedbackPage.expires_at), 'yyyy-MM-dd HH:mm') : '';

  return (
    <Box
      minHeight="100vh"
      bg={useColorModeValue('gray.50', 'gray.900')}
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={8}
    >
      <Container maxW="md">
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow="md"
          borderRadius="lg"
          p={6}
        >
          {isSubmitted ? (
            <VStack spacing={3} align="stretch">
              <Heading size="md" textAlign="center" color={useColorModeValue('blue.600', 'blue.300')}>
                Geri Bildiriminiz Alındı
              </Heading>
              <Text textAlign="center" fontSize="sm">
                Değerli geri bildiriminiz için teşekkür ederiz. Katkınız bizim için çok önemli.
              </Text>
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch">
              <Heading size="lg" textAlign="center" color={useColorModeValue('blue.600', 'blue.300')}>
                {feedbackPage?.title}
              </Heading>
              <Text mb="3" fontSize="sm" textAlign="center" color={useColorModeValue('gray.600', 'gray.400')}>
                {feedbackPage?.description}
              </Text>
              <Flex justifyContent="space-between" fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')}>
                <Text>Oluşturan: {feedbackPage?.username}</Text>
                <Text>Bitiş: {formattedExpiresAt}</Text>
              </Flex>

              <Formik
                initialValues={{ email: '', content: '', feedbackType: 'tebrik' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting, values }) => (
                  <Form>
                    <VStack spacing={3}>
                      <Field name="email">
                        {({ field }: any) => (
                          <FormControl isInvalid={!!(errors.email && touched.email)}>
                            <FormLabel fontSize="sm">Email</FormLabel>
                            <Input
                              {...field}
                              focusBorderColor='blue.500'
                              bg={useColorModeValue('white', 'gray.700')}
                              size="sm"
                            />
                            <FormErrorMessage fontSize="xs">{errors.email}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="feedbackType">
                        {({ field }: any) => (
                          <FormControl>
                            <FormLabel fontSize="sm">Bildirim Tipi</FormLabel>
                            <Select
                              {...field}
                              focusBorderColor='blue.500'
                              bg={useColorModeValue('white', 'gray.700')}
                              color={getFeedbackTypeColor(feedbackTypeMap[values.feedbackType] || values.feedbackType)}
                              size="sm"
                            >
                              <option value="tebrik">Tebrik</option>
                              <option value="öneri">Öneri</option>
                              <option value="şikayet">Şikayet</option>
                              <option value="istek">İstek</option>
                            </Select>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="content">
                        {({ field }: any) => (
                          <FormControl isInvalid={!!(errors.content && touched.content)}>
                            <FormLabel fontSize="sm">İçerik</FormLabel>
                            <Textarea
                              {...field}
                              focusBorderColor='blue.500'
                              minHeight="100px"
                              bg={useColorModeValue('white', 'gray.700')}
                              size="sm"
                            />
                            <FormErrorMessage fontSize="xs">{errors.content}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Button
                        mt={2}
                        colorScheme="blue"
                        isLoading={isSubmitting}
                        type="submit"
                        width="full"
                        bg={getFeedbackTypeColor(feedbackTypeMap[values.feedbackType] || values.feedbackType)}
                        _hover={{ opacity: 0.8 }}
                        size="sm"
                      >
                        Gönder
                      </Button>
                    </VStack>
                  </Form>
                )}
              </Formik>
            </VStack>
          )}
          <Text mt={4} textAlign="center" fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')}>
            Naho tarafından oluşturuldu.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}