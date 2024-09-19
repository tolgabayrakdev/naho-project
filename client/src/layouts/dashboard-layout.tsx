import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
    Box,
    Flex,
    VStack,
    IconButton,
    useDisclosure,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Text,
    Button,
    useColorMode,
    Spacer,
    useColorModeValue,
    Portal
} from '@chakra-ui/react'
import { HamburgerIcon, ViewIcon, SunIcon, MoonIcon, TriangleUpIcon } from '@chakra-ui/icons'
import AuthWrapper from '../wrappers/auth-wrapper'

// NavItem bileşeni
const NavItem = ({ icon, children, to, onClick }: { icon: React.ReactNode, children: React.ReactNode, to: string, onClick: (to: string) => void }) => {
    const location = useLocation()
    const active = location.pathname === to

    return (
        <Button
            leftIcon={icon ? <>{icon}</> : undefined}
            variant={active ? "solid" : "ghost"}
            colorScheme={active ? "blue" : "gray"}
            justifyContent="flex-start"
            width="100%"
            borderRadius="md"
            mb={2}
            onClick={() => onClick(to)}
        >
            {children}
        </Button>
    )
}

// Sidebar bileşeni
const Sidebar = ({ onNavigate }: { onNavigate: (to: string) => void }) => {
    return (
        <VStack align="stretch" spacing={4} p={4}>
            <NavItem icon={<ViewIcon />} to="/dashboard" onClick={onNavigate}>
                Dashboard
            </NavItem>
            <NavItem icon={<TriangleUpIcon />} to="/dashboard/profile" onClick={onNavigate}>
                Profil
            </NavItem>
        </VStack>
    )
}

function DashboardLayout() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { colorMode, toggleColorMode } = useColorMode()
    const navigate = useNavigate()
    const [isLogoutLoading, setIsLogoutLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)


    useEffect(() => {
        setIsMounted(true)
        return () => setIsMounted(false)
    }, [])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isOpen) {
                onClose()
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isOpen, onClose])

    const handleNavigation = useCallback((to: string) => {
        navigate(to)
    }, [navigate])

    const handleLogout = useCallback(async () => {
        setIsLogoutLoading(true);
        setTimeout(async() => {
            try {
                const res = await fetch("http://localhost:8000/api/auth/logout", {
                    method: "POST",
                    credentials: "include"
                })
                if (res.status === 200) {
                    navigate('/sign-in')
                } else {
                    console.error('Logout failed')
                }
            } catch (error) {
                console.error('Logout error:', error)
            } finally {
                setIsLogoutLoading(false)
            }
        }, 500)
    }, [navigate])

    // Renk değerlerini useColorModeValue ile ayarlayalım
    const sidebarBg = useColorModeValue('gray.50', 'gray.900')
    const borderColor = useColorModeValue('gray.200', 'gray.700')
    const headerBg = useColorModeValue('white', 'gray.800')
    const footerBg = useColorModeValue('gray.100', 'gray.700')

    return (
        <Flex minH="100vh">
            {/* Desktop için sabit Sidebar */}
            <Box
                width="250px"
                bg={sidebarBg}
                height="100vh"
                position="fixed"
                left={0}
                top={0}
                display={{ base: 'none', md: 'flex' }}
                flexDirection="column"
                borderRightWidth="1px"
                borderRightColor={borderColor}
            >
                <Box p={4} display="flex" justifyContent="center" alignItems="center">
                    <Text fontSize="2xl" fontWeight="bold">Dashboard</Text>
                </Box>
                <Box flex={1} overflowY="auto">
                    <Sidebar onNavigate={handleNavigation} />
                </Box>
            </Box>

            {/* Ana içerik alanı */}
            <Flex flexDirection="column" flex={1} ml={{ base: 0, md: '250px' }}>
                <Flex
                    bg={headerBg}
                    p={4}
                    borderBottomWidth="1px"
                    borderBottomColor={borderColor}
                    alignItems="center"
                >
                    <IconButton
                        icon={<HamburgerIcon />}
                        onClick={onOpen}
                        display={{ base: 'flex', md: 'none' }}
                        aria-label="Open menu"
                    />
                    <Spacer />
                    <IconButton
                        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        onClick={toggleColorMode}
                        aria-label="Toggle color mode"
                        mr={2}
                    />
                    <Button
                        colorScheme="red"
                        onClick={handleLogout}
                        isLoading={isLogoutLoading}
                        loadingText="Çıkış yapılıyor..."
                    >
                        Çıkış Yap
                    </Button>
                </Flex>

                <Box flex={1} p={4} overflowY="auto">
                    <Outlet />
                </Box>

                {/* Footer */}
                <Box as="footer" bg={footerBg} p={4} textAlign="center" borderTopWidth="1px" borderTopColor={borderColor}>
                    <Text>&copy; 2024 @Dashboard App</Text>
                </Box>
            </Flex>

            {isMounted && (
                <Portal>
                    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                        <DrawerOverlay />
                        <DrawerContent bg={sidebarBg}>
                            <DrawerCloseButton />
                            <DrawerHeader borderBottomWidth="1px">Dashboard Menü</DrawerHeader>
                            <DrawerBody>
                                <Sidebar onNavigate={(to) => {
                                    handleNavigation(to)
                                    onClose()
                                }} />
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </Portal>
            )}
        </Flex>
    )
}

export default AuthWrapper(DashboardLayout);