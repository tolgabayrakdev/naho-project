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
    Portal,
    Collapse,
    Divider
} from '@chakra-ui/react'
import { HamburgerIcon, SunIcon, MoonIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import AuthWrapper from '../wrappers/auth-wrapper'
import { BiCreditCard, BiCreditCardAlt, BiCreditCardFront, BiGlobeAlt, BiHome, BiMobile, BiNetworkChart, BiUser } from 'react-icons/bi'
import { FcCollaboration } from 'react-icons/fc'

const NavItem = ({ icon, children, to, onClick, hasSubItems = false, isOpen, onToggle }: { icon: React.ReactNode, children: React.ReactNode, to?: string, onClick?: (to: string) => void, hasSubItems?: boolean, isOpen?: boolean, onToggle?: () => void }) => {
    const location = useLocation()
    const active = to ? location.pathname === to : false

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
            onClick={() => {
                if (hasSubItems && onToggle) {
                    onToggle()
                } else if (to && onClick) {
                    onClick(to)
                }
            }}
            _hover={{ bg: hoverBg }}
            borderRadius="md"
            justifyContent="space-between"
        >
            <Flex align="center">
                {icon && <Box mr={3}>{icon}</Box>}
                <Text fontWeight="normal">{children}</Text>
            </Flex>
            {hasSubItems && (isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />)}
        </Flex>
    )
}

// Sidebar component
const Sidebar = ({ onNavigate, onLogout, isLogoutLoading }: { onNavigate: (to: string) => void, onLogout: () => void, isLogoutLoading: boolean }) => {
    const { colorMode, toggleColorMode } = useColorMode()
    const [isNetworkOpen, setIsNetworkOpen] = useState(false)

    return (
        <VStack align="stretch" spacing={3} p={4} height="100%">
            <Box flex={1}>
                <NavItem icon={<BiHome />} to="/dashboard" onClick={onNavigate}>
                    Dashboard
                </NavItem>
                <NavItem icon={<BiUser />} to="/dashboard/profile" onClick={onNavigate}>
                    Profil
                </NavItem>
                <NavItem
                    icon={<BiNetworkChart />}
                    hasSubItems={true}
                    isOpen={isNetworkOpen}
                    onToggle={() => setIsNetworkOpen(!isNetworkOpen)}
                >
                    Bildirim İşlemleri
                </NavItem>
                <Collapse in={isNetworkOpen} animateOpacity>
                    <Box pl={6} mt={1} borderLeft="1px" borderColor="gray.200">
                        <NavItem icon={<BiCreditCardFront />} to="/dashboard/feedbacks" onClick={onNavigate}>
                            Geri Bildirimler
                        </NavItem>
                        <NavItem icon={<BiCreditCard />} to="/dashboard/feedback/pages" onClick={onNavigate}>
                             Bildirim Sayfaları
                        </NavItem>
                        <NavItem icon={<BiCreditCardAlt />} to="/dashboard/feedback/preview-page" onClick={onNavigate}>
                             Önizleme Sayfaları
                        </NavItem>
                    </Box>
                </Collapse>

                  
                <Divider my={3} />
                
                <Text fontWeight="bold" mb={2}>Tasarım İşlemleri</Text>
                <NavItem icon={<BiMobile />} to="/design/mobile" onClick={onNavigate}>
                    Mobil Tasarım
                </NavItem>
                <NavItem icon={<BiGlobeAlt />} to="/design/web" onClick={onNavigate}>
                    Web Tasarım
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
                display={{ base: 'none', lg: 'flex' }}  // Changed from 'md' to 'lg'
                flexDirection="column"
                borderRightWidth="1px"
                borderRightColor={borderColor}
            >
                <Box p={4} display="flex" justifyContent="center" alignItems="center">
                    <FcCollaboration size="1.5em" />
                    <Text fontSize="2xl" fontWeight="bold">Naho</Text>
                </Box>
                <Box flex={1} overflowY="auto">
                    <Sidebar onNavigate={handleNavigation} onLogout={handleLogout} isLogoutLoading={isLogoutLoading} />
                </Box>
            </Box>

            {/* Main content area */}
            <Flex flexDirection="column" flex={1} ml={{ base: 0, lg: '250px' }}>
                <Box flex={1} p={6} overflowY="auto" bg={contentBg}>
                    <IconButton
                        icon={<HamburgerIcon />}
                        onClick={onOpen}
                        display={{ base: 'flex', lg: 'none' }} 
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