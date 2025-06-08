import {
  Box,
  Button,
  Text,
  IconButton,
  useToast,
  SimpleGrid,
  Flex,
  Badge,
  VStack,
} from "@chakra-ui/react";
import { FiEdit, FiTrash2, FiMoon, FiSun } from "react-icons/fi";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Sleep {
  id: number;
  sleepTime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes: string;
}

const SleepList = () => {
  const [sleeps, setSleeps] = useState<Sleep[]>([]);
  const toast = useToast();

  useEffect(() => {
    loadSleepRecords();
  }, []);

  const loadSleepRecords = async () => {
    try {
      console.log('데이터 로딩 시작');
      const response = await axios.get("http://localhost:8000/api/sleep");
      console.log('서버 응답:', response.data);
      setSleeps(response.data);
    } catch (error) {
      console.error('데이터 로딩 에러:', error);
      toast({
        title: "데이터 로드 실패",
        description: "수면 기록을 불러오는데 실패했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/sleep/${id}`);
      toast({
        title: "삭제 완료",
        description: "수면 기록이 삭제되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      loadSleepRecords();
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "수면 기록 삭제에 실패했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDateTime = (dateStr: string) => {
    return format(new Date(dateStr), "MM/dd (E) HH:mm", { locale: ko });
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return "green";
    if (quality >= 6) return "blue";
    if (quality >= 4) return "yellow";
    return "red";
  };

  return (
    <Box>
      <Box mb={6} display="flex" justifyContent="flex-end">
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
      </Box>

      {sleeps.length === 0 ? (
        <Box
          textAlign="center"
          py={10}
          px={6}
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
        >
          <Text fontSize="lg" color="gray.600">
            아직 기록된 수면 데이터가 없습니다.
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {sleeps.map((sleep) => (
            <Box
              key={sleep.id}
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="lg"
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "xl",
              }}
            >
              <VStack align="stretch" spacing={4}>
                <Flex justify="space-between" align="center">
                  <Badge
                    colorScheme={getQualityColor(sleep.quality)}
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    수면 품질: {sleep.quality}/10
                  </Badge>
                  <Flex gap={2}>
                    <IconButton
                      as={Link}
                      to={`/edit/${sleep.id}`}
                      aria-label="Edit"
                      icon={<FiEdit />}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(sleep.id)}
                    />
                  </Flex>
                </Flex>

                <Box>
                  <Flex align="center" gap={2} mb={2}>
                    <FiMoon />
                    <Text fontWeight="medium">
                      취침: {formatDateTime(sleep.sleepTime)}
                    </Text>
                  </Flex>
                  <Flex align="center" gap={2} mb={2}>
                    <FiSun />
                    <Text fontWeight="medium">
                      기상: {formatDateTime(sleep.wakeTime)}
                    </Text>
                  </Flex>
                  <Text color="green.600" fontWeight="bold">
                    총 수면 시간: {sleep.duration.toFixed(1)}시간
                  </Text>
                </Box>

                {sleep.notes && (
                  <Text
                    color="gray.600"
                    fontSize="sm"
                    p={3}
                    bg="gray.50"
                    borderRadius="md"
                  >
                    {sleep.notes}
                  </Text>
                )}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default SleepList; 