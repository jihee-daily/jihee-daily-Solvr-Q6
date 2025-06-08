import { ChakraProvider, Box, Container } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import SleepList from "./components/SleepList";
import SleepForm from "./components/SleepForm";
import Header from "./components/Header";
import Statistics from "./components/Statistics";

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
            <Route path="/" element={
              <>
                <Statistics />
                <SleepList />
              </>
            } />
            <Route path="/add" element={<SleepForm />} />
            <Route path="/edit/:id" element={<SleepForm />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
