import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Heading,
    Button,
    FormControl,
    FormLabel,
    Input,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    HStack,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    FormErrorMessage,
    Divider,
    SimpleGrid,
    Text,
    Switch,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [user, setUser] = useState({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const toast = useToast();
    const cancelRef = React.useRef<HTMLButtonElement>(null);
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [integrations, setIntegrations] = useState({
        whatsapp: false,
        instagram: false,
        twitter: false,
        facebook: false,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/auth/verify", {
                    method: "POST",
                    credentials: "include"
                });
                if (!response.ok) {
                    throw new Error('Sunucu yanıtı başarısız');
                }
                const data = await response.json();
                const { username, email } = data.user;
                setUser(prevUser => ({ ...prevUser, username, email }));
            } catch (error) {
                console.error('Kullanıcı bilgileri alınamadı:', error);
                toast({
                    title: 'Kullanıcı bilgileri alınamadı.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        };

        fetchUserData();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Profil güncellenemedi');
            }

            const data = await response.json();
            setUser(prevUser => ({ ...prevUser, ...data.user }));
            setIsEditing(false);
            toast({
                title: 'Profil güncellendi.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Profil güncellenirken hata oluştu:', error);
            toast({
                title: 'Profil güncellenemedi.',
                description: 'Lütfen daha sonra tekrar deneyin.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/user/delete-account', {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Hesap silinemedi');
            }

            setIsDeleteDialogOpen(false);
            toast({
                title: 'Hesap silindi.',
                status: 'info',
                duration: 3000,
                isClosable: true,
            });

            // Kullanıcıyı giriş ekranına yönlendir
            navigate('/signin');
        } catch (error) {
            console.error('Hesap silinirken hata oluştu:', error);
            toast({
                title: 'Hesap silinemedi.',
                description: 'Lütfen daha sonra tekrar deneyin.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const validatePasswordChange = () => {
        let isValid = true;
        const newErrors = {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        };

        if (!user.currentPassword) {
            newErrors.currentPassword = 'Mevcut şifre gereklidir';
            isValid = false;
        }

        if (!user.newPassword) {
            newErrors.newPassword = 'Yeni şifre gereklidir';
            isValid = false;
        } else if (user.newPassword.length < 6) {
            newErrors.newPassword = 'Yeni şifre en az 6 karakterli olmalıdır';
            isValid = false;
        }

        if (!user.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Şifre onayı gereklidir';
            isValid = false;
        }

        if (user.newPassword !== user.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Şifreler eşleşmiyor';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChangePassword = async () => {
        if (validatePasswordChange()) {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/user/change-password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        current_password: user.currentPassword,
                        new_password: user.newPassword,
                    }),
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Şifre değiştirilemedi');
                }

                toast({
                    title: 'Şifre başarıyla değiştirildi.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setUser({ ...user, currentPassword: '', newPassword: '', confirmNewPassword: '' });
                setErrors({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            } catch (error) {
                console.error('Şifre değiştirilirken hata oluştu:', error);
                toast({
                    title: 'Şifre değiştirilemedi.',
                    description: 'Lütfen mevcut şifrenizi kontrol edin ve tekrar deneyin.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    const handleIntegrationChange = (integration: keyof typeof integrations) => {
        setIntegrations(prev => ({ ...prev, [integration]: !prev[integration] }));
    };

    return (
        <>
            <Box>
                <Heading size="lg" mb={4}>Profil</Heading>
                <Tabs variant="enclosed">
                    <TabList>
                        <Tab>Profil Bilgileri</Tab>
                        <Tab>Şifre Değiştir</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Box maxWidth="400px">
                                <VStack spacing={4} align="stretch">
                                    <FormControl>
                                        <FormLabel>Kullanıcı Adı</FormLabel>
                                        <Input
                                            value={user.username}
                                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                                            isReadOnly={!isEditing}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>E-posta</FormLabel>
                                        <Input
                                            value={user.email}
                                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                                            isReadOnly={!isEditing}
                                        />
                                    </FormControl>
                                    <HStack spacing={4}>
                                        {isEditing ? (
                                            <Button size="sm" colorScheme="blue" onClick={handleSave}>Kaydet</Button>
                                        ) : (
                                            <Button size="sm" onClick={handleEdit}>Düzenle</Button>
                                        )}
                                        <Button size="sm" colorScheme="red" onClick={() => setIsDeleteDialogOpen(true)}>
                                            Hesabı Sil
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Box>
                        </TabPanel>
                        <TabPanel>
                            <Box maxWidth="400px">
                                <VStack spacing={4} align="stretch">
                                    <FormControl isInvalid={!!errors.currentPassword}>
                                        <FormLabel>Mevcut Şifre</FormLabel>
                                        <Input
                                            type="password"
                                            value={user.currentPassword}
                                            onChange={(e) => setUser({ ...user, currentPassword: e.target.value })}
                                        />
                                        <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.newPassword}>
                                        <FormLabel>Yeni Şifre</FormLabel>
                                        <Input
                                            type="password"
                                            value={user.newPassword}
                                            onChange={(e) => setUser({ ...user, newPassword: e.target.value })}
                                        />
                                        <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.confirmNewPassword}>
                                        <FormLabel>Yeni Şifre (Tekrar)</FormLabel>
                                        <Input
                                            type="password"
                                            value={user.confirmNewPassword}
                                            onChange={(e) => setUser({ ...user, confirmNewPassword: e.target.value })}
                                        />
                                        <FormErrorMessage>{errors.confirmNewPassword}</FormErrorMessage>
                                    </FormControl>
                                    <Button
                                        size="sm"
                                        colorScheme="green"
                                        onClick={handleChangePassword}
                                        width="150px"
                                    >
                                        Şifreyi Değiştir
                                    </Button>
                                </VStack>
                            </Box>
                        </TabPanel>
                    </TabPanels>
                </Tabs>

                <Divider my={8} />

                <Box>
                    <Heading size="md" mb={6}>Entegrasyonlar</Heading>
                    <SimpleGrid columns={2} spacing={4}>
                        <IntegrationItem
                            icon={FaWhatsapp}
                            name="WhatsApp"
                            isActive={integrations.whatsapp}
                            onChange={() => handleIntegrationChange('whatsapp')}
                        />
                        <IntegrationItem
                            icon={FaInstagram}
                            name="Instagram"
                            isActive={integrations.instagram}
                            onChange={() => handleIntegrationChange('instagram')}
                        />
                        <IntegrationItem
                            icon={FaTwitter}
                            name="Twitter"
                            isActive={integrations.twitter}
                            onChange={() => handleIntegrationChange('twitter')}
                        />
                        <IntegrationItem
                            icon={FaFacebook}
                            name="Facebook"
                            isActive={integrations.facebook}
                            onChange={() => handleIntegrationChange('facebook')}
                        />
                    </SimpleGrid>
                </Box>

                <AlertDialog
                    isOpen={isDeleteDialogOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={() => setIsDeleteDialogOpen(false)}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Hesabı Sil
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                                    İptal
                                </Button>
                                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                    Sil
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Box>
        </>
    );
};

interface IntegrationItemProps {
    icon: React.ElementType;
    name: string;
    isActive: boolean;
    onChange: () => void;
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({ icon: Icon, name, isActive, onChange }) => {
    return (
        <HStack justifyContent="space-between">
            <HStack>
                <Icon />
                <Text>{name}</Text>
            </HStack>
            <Switch isChecked={isActive} onChange={onChange} />
        </HStack>
    );
};

export default Profile;