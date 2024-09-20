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
    useColorModeValue,
    Portal
} from '@chakra-ui/react'
import { HamburgerIcon, SunIcon, MoonIcon } from '@chakra-ui/icons'
import AuthWrapper from '../wrappers/auth-wrapper'
import { BiHome, BiUser } from 'react-icons/bi'

// NavItem component
const NavItem = ({ icon, children, to, onClick }: { icon: React.ReactNode, children: React.ReactNode, to: string, onClick: (to: string) => void }) => {
    const location = useLocation()
    const active = location.pathname === to

    const activeColor = useColorModeValue("blue.500", "blue.200")
    const hoverBg = useColorModeValue("gray.100", "gray.700")
    const textColor = useColorModeValue("gray.800", "whiteAlpha.900")

    return (
        <Flex
            align="center"
            px={3}
            py={2}
            cursor="pointer"
            color={active ? activeColor : textColor}
            onClick={() => onClick(to)}
            _hover={{ bg: hoverBg }}
            borderRadius="md"
        >
            {icon && <Box mr={3}>{icon}</Box>}
            <Text fontWeight="normal">{children}</Text>
        </Flex>
    )
}

// Sidebar component
const Sidebar = ({ onNavigate, onLogout, isLogoutLoading }: { onNavigate: (to: string) => void, onLogout: () => void, isLogoutLoading: boolean }) => {
    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <VStack align="stretch" spacing={3} p={4} height="100%">
            <Box flex={1}>
                <NavItem icon={<BiHome />} to="/dashboard" onClick={onNavigate}>
                    Dashboard
                </NavItem>
                <NavItem icon={<BiUser />} to="/dashboard/profile" onClick={onNavigate}>
                    Profil
                </NavItem>
            </Box>
            <Box>
                <Button
                    size="sm"
                    leftIcon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                    onClick={toggleColorMode}
                    width="100%"
                    mb={2}
                >
                    {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
                </Button>
                <Button
                    size="sm"
                    colorScheme="red"
                    onClick={onLogout}
                    isLoading={isLogoutLoading}
                    loadingText="Çıkış yapılıyor..."
                    width="100%"
                >
                    Çıkış Yap
                </Button>
            </Box>
        </VStack>
    )
}

function DashboardLayout() {
    const { isOpen, onOpen, onClose } = useDisclosure()
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
        setTimeout(async () => {
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

    // Set color values using useColorModeValue
    const sidebarBg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')
    const contentBg = useColorModeValue('white', 'gray.800')

    return (
        <Flex minH="100vh">
            {/* Fixed Sidebar for Desktop */}
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
                    <Sidebar onNavigate={handleNavigation} onLogout={handleLogout} isLogoutLoading={isLogoutLoading} />
                </Box>
            </Box>

            {/* Main content area */}
            <Flex flexDirection="column" flex={1} ml={{ base: 0, md: '250px' }}>
                <Box flex={1} p={4} overflowY="auto" bg={contentBg}>
                    <IconButton
                        icon={<HamburgerIcon />}
                        onClick={onOpen}
                        display={{ base: 'flex', md: 'none' }}
                        aria-label="Open menu"
                        mb={4}
                    />
                    <Outlet />
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
                                <Sidebar
                                    onNavigate={(to) => {
                                        handleNavigation(to)
                                        onClose()
                                    }}
                                    onLogout={handleLogout}
                                    isLogoutLoading={isLogoutLoading}
                                />
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </Portal>
            )}
        </Flex>
    )
}

export default AuthWrapper(DashboardLayout);