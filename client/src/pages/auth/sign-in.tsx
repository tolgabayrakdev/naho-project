import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link as ChakraLink, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

const SignInSchema = Yup.object().shape({
    email: Yup.string().email('Geçersiz email').required('Email gerekli'),
    password: Yup.string().required('Şifre gerekli'),
});

const SignIn = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);

    const handleLogin = async (values: { email: string; password: string }, actions: any) => {
        try {
            const res = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify(values),
            })
            if (res.status === 200) {
                setIsLoginSuccessful(true);
                toast({
                    title: 'Giriş başarılı.',
                    description: "Yönlendiriliyorsunuz...",
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                })
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000)
            } else {
                toast({
                    title: 'Giriş başarısız.',
                    description: "Bilgilerinizi kontrol ediniz!",
                    status: 'warning',
                    duration: 1000,
                    isClosable: true,
                })
            }
        } catch (error) {
            toast({
                title: 'Hata',
                description: "Bir hata oluştu. Lütfen tekrar deneyin.",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        } finally {
            actions.setSubmitting(false);
        }
    }

    return (
        <>
            <Box maxWidth="400px" margin="auto" mt={8}>
                <VStack spacing={8} align="stretch">
                    <Heading textAlign="center">Giriş Yap</Heading>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={SignInSchema}
                        onSubmit={(values, actions) => {
                            handleLogin(values, actions);
                        }}
                    >
                        {(props) => (
                            <Form>
                                <VStack spacing={4}>
                                    <Field name="email">
                                        {({ field, form }: any) => (
                                            <FormControl isInvalid={form.errors.email && form.touched.email}>
                                                <FormLabel htmlFor="email">Email</FormLabel>
                                                <Input {...field} id="email" placeholder="Email" />
                                                <Text color="red.500">{form.errors.email}</Text>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="password">
                                        {({ field, form }: any) => (
                                            <FormControl isInvalid={form.errors.password && form.touched.password}>
                                                <FormLabel htmlFor="password">Şifre</FormLabel>
                                                <Input {...field} id="password" type="password" placeholder="Şifre" />
                                                <Text color="red.500">{form.errors.password}</Text>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Button
                                        mt={4}
                                        colorScheme="blue"
                                        isLoading={props.isSubmitting}
                                        type="submit"
                                        width="full"
                                        isDisabled={isLoginSuccessful}
                                    >
                                        Giriş Yap
                                    </Button>
                                    <ChakraLink as={RouterLink} to="/forgot-password" color="blue.500" alignSelf="flex-start">
                                        Şifremi Unuttum
                                    </ChakraLink>
                                </VStack>
                            </Form>
                        )}
                    </Formik>
                    <Text textAlign="center">
                        Hesabınız yok mu?{' '}
                        <ChakraLink as={RouterLink} to="/sign-up" color="blue.500">
                            Kayıt Ol
                        </ChakraLink>
                    </Text>
                </VStack>
            </Box>
        </>

    );
};

export default SignIn;