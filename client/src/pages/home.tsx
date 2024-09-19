import { Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Flex justify="center" align="center" height="100vh" direction="column">
      <Text fontSize="3xl">Hoşgeldin.</Text>
      <Link style={{ textDecoration: 'underline' }} to="/sign-in">Giriş Yap</Link>
    </Flex>
  )
}
