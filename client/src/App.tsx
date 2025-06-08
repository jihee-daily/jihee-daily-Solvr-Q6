import { ChakraProvider, Box, Container } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import SleepList from "./components/SleepList";
import SleepForm from "./components/SleepForm";
import Header from "./components/Header";

function App() {
  return (
    <ChakraProvider>
      <Box
        minH="100vh"
        bgGradient="linear(to-b, gray.50, blue.50)"
        backgroundAttachment="fixed"
      >
        <Header />
        <Container maxW="container.lg" py={8}>
          <Routes>
            <Route path="/" element={<SleepList />} />
            <Route path="/add" element={<SleepForm />} />
            <Route path="/edit/:id" element={<SleepForm />} />
          </Routes>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
