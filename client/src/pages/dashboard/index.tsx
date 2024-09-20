import { Heading } from "@chakra-ui/react";
import Charts from "../../components/dashboard/charts";

export default function Index() {
    return (
        <div>
            <Heading size="md" mb={6}>Anasayfa</Heading>
            <Charts />
        </div>
    )
}