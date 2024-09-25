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
  FormErrorMessage,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

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
      bg={useColorModeValue('white', 'gray.800')}
      backgroundImage="url('https://plus.unsplash.com/premium_photo-1682309735318-934795084028?q=80&w=3012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      p={5}
    >
      <Center>
        <Box
          p={8}
          maxWidth="600px"
          width="100%"
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow="xl"
          borderRadius="xl"
          opacity={0.95}
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
              <Heading size="lg" textAlign="center" color={useColorModeValue('teal.600', 'teal.300')} mb={6}>
                {feedbackPage?.title}
              </Heading>
              <Text mb={4} textAlign="center" color={useColorModeValue('gray.600', 'gray.400')}>
                {feedbackPage?.description}
              </Text>
              <Text mb={4} textAlign="center" color={useColorModeValue('gray.600', 'gray.400')}>
                Oluşturan: {feedbackPage?.username} ({feedbackPage?.email})
              </Text>
              <Text mb={6} textAlign="center" color={useColorModeValue('gray.600', 'gray.400')}>
                Bitiş Tarihi: {formattedExpiresAt}
              </Text>

              <Box mt={8}>
                <Heading size="md" textAlign="center" color={useColorModeValue('teal.600', 'teal.300')} mb={6}>
                  Geri Bildirim Formu
                </Heading>
                <Formik
                  initialValues={{ email: '', content: '', feedbackType: 'tebrik' }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isSubmitting, values }) => (
                    <Form>
                      <Field name="email">
                        {({ field }: any) => (
                          <FormControl isInvalid={!!(errors.email && touched.email)} mb={4}>
                            <FormLabel>Email</FormLabel>
                            <Input
                              {...field}
                              focusBorderColor='teal.500'
                              bg={useColorModeValue('gray.50', 'gray.700')}
                              borderColor={useColorModeValue('gray.200', 'gray.600')}
                            />
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="content">
                        {({ field }: any) => (
                          <FormControl isInvalid={!!(errors.email && touched.email)} mb={4}>
                            <FormLabel>İçerik</FormLabel>
                            <Textarea
                              {...field}
                              focusBorderColor='teal.500'
                              bg={useColorModeValue('gray.50', 'gray.700')}
                              borderColor={useColorModeValue('gray.200', 'gray.600')}
                            />
                            <FormErrorMessage>{errors.content}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="feedbackType">
                        {({ field }: any) => (
                          <FormControl mb={4}>
                            <FormLabel>Bildirim Tipi</FormLabel>
                            <Select
                              {...field}
                              focusBorderColor='teal.500'
                              bg={useColorModeValue('gray.50', 'gray.700')}
                              borderColor={useColorModeValue('gray.200', 'gray.600')}
                              color={getFeedbackTypeColor(feedbackTypeMap[values.feedbackType] || values.feedbackType)}
                            >
                              <option value="tebrik">Tebrik</option>
                              <option value="öneri">Öneri</option>
                              <option value="şikayet">Şikayet</option>
                              <option value="istek">İstek</option>
                            </Select>
                          </FormControl>
                        )}
                      </Field>
                      <Button
                        mt={4}
                        colorScheme="teal"
                        isLoading={isSubmitting}
                        type="submit"
                        width="100%"
                        bg={getFeedbackTypeColor(feedbackTypeMap[values.feedbackType] || values.feedbackType)}
                        _hover={{ bg: getFeedbackTypeColor(feedbackTypeMap[values.feedbackType] || values.feedbackType), opacity: 0.8 }}
                      >
                        Gönder
                      </Button>
                    </Form>
                  )}
                </Formik>
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