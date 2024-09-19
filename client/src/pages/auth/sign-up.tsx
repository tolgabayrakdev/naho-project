import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link as ChakraLink, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

const SignUpSchema = Yup.object().shape({
    username: Yup.string().required('Kullanıcı adı gerekli'),
    email: Yup.string().email('Geçersiz email').required('Email gerekli'),
    password: Yup.string().min(6, 'Şifre en az 6 karakter olmalı').required('Şifre gerekli'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor')
        .required('Şifre onayı gerekli'),
});

const SignUp = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);

    const handleRegister = async (values: { username: string, email: string, password: string }, actions: any) => {
        try {
            const res = await fetch("http://localhost:8000/api/v1/authentication/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
            if (res.status === 201) {
                setIsSignUpSuccessful(true);
                toast({
                    title: 'Hesap oluşturma başarılı',
                    description: "Yönlendiriliyorsunuz...",
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                })
                setTimeout(() => {
                    navigate('/signin');
                }, 1000)
            } else {
                toast({
                    title: 'Kayıt başarısız.',
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
                    <Heading textAlign="center">Kayıt Ol</Heading>
                    <Formik
                        initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
                        validationSchema={SignUpSchema}
                        onSubmit={(values, actions) => {
                            handleRegister(values, actions);
                        }}
                    >
                        {(props) => (
                            <Form>
                                <VStack spacing={4}>
                                    <Field name="username">
                                        {({ field, form }: any) => (
                                            <FormControl isInvalid={form.errors.username && form.touched.username}>
                                                <FormLabel htmlFor="username">Kullanıcı Adı</FormLabel>
                                                <Input {...field} id="username" placeholder="Kullanıcı adı" />
                                                <Text color="red.500">{form.errors.username}</Text>
                                            </FormControl>
                                        )}
                                    </Field>
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
                                    <Field name="confirmPassword">
                                        {({ field, form }: any) => (
                                            <FormControl isInvalid={form.errors.confirmPassword && form.touched.confirmPassword}>
                                                <FormLabel htmlFor="confirmPassword">Şifre Onayı</FormLabel>
                                                <Input {...field} id="confirmPassword" type="password" placeholder="Şifre Onayı" />
                                                <Text color="red.500">{form.errors.confirmPassword}</Text>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Button
                                        mt={4}
                                        colorScheme="blue"
                                        isLoading={props.isSubmitting}
                                        type="submit"
                                        width="full"
                                        isDisabled={isSignUpSuccessful}
                                    >
                                        Kayıt Ol
                                    </Button>
                                </VStack>
                            </Form>
                        )}
                    </Formik>
                    <Text textAlign="center">
                        Zaten hesabınız var mı?{' '}
                        <ChakraLink as={RouterLink} to="/sign-in" color="blue.500">
                            Giriş Yap
                        </ChakraLink>
                    </Text>
                </VStack>
            </Box>
        </>

    );
};

export default SignUp;