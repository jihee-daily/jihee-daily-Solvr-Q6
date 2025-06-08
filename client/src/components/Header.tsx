import { Box, Container, Heading, Flex, Icon, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiMoon } from "react-icons/fi";

const Header = () => {
  return (
    <Box
      py={4}
      bg="gray.50"
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
      backdropFilter="blur(10px)"
    >
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center">
          <Link to="/">
            <Flex 
              align="center" 
              gap={2}
              _hover={{
                transform: "scale(1.05)",
                transition: "transform 0.2s"
              }}
            >
              <Icon 
                as={FiMoon} 
                w={7} 
                h={7} 
                color="orange.400"
              />
              <Heading 
                size="lg" 
                color="orange.400" 
                fontWeight="bold"
              >
                Deep Sleep
              </Heading>
            </Flex>
          </Link>
          <Button
            as={Link}
            to="/add"
            bgGradient="linear(to-r, orange.400, yellow.400)"
            color="white"
            px={6}
            borderRadius="full"
            _hover={{
              bgGradient: "linear(to-r, orange.500, yellow.500)",
              transform: "translateY(-2px)",
            }}
            _active={{
              bgGradient: "linear(to-r, orange.600, yellow.600)",
            }}
            transition="all 0.2s"
            fontWeight="bold"
            boxShadow="md"
          >
            새 기록 추가
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header; 