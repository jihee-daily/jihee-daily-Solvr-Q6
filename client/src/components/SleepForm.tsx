import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Select,
  useToast,
  Heading,
  FormHelperText,
  Icon,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { FiMoon, FiSun, FiSave } from "react-icons/fi";
import axios from "axios";

interface SleepFormData {
  sleepTime: string;
  wakeTime: string;
  quality: number;
  notes: string;
}

const SleepForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState<SleepFormData>({
    sleepTime: "",
    wakeTime: "",
    quality: 5,
    notes: "",
  });

  useEffect(() => {
    if (id) {
      loadSleepRecord();
    }
  }, [id]);

  const loadSleepRecord = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/sleep/${id}`);
      const data = response.data;
      setFormData({
        sleepTime: new Date(data.sleepTime).toISOString().slice(0, 16),
        wakeTime: new Date(data.wakeTime).toISOString().slice(0, 16),
        quality: data.quality,
        notes: data.notes || "",
      });
    } catch (error) {
      toast({
        title: "데이터 로드 실패",
        description: "수면 기록을 불러오는데 실패했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:8000/api/sleep/${id}`, formData);
      } else {
        await axios.post("http://localhost:8000/api/sleep", formData);
      }
      toast({
        title: "성공",
        description: `수면 기록이 ${id ? "수정" : "저장"}되었습니다.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "오류 발생",
        description: `수면 기록 ${id ? "수정" : "저장"} 중 오류가 발생했습니다.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={8}
      borderWidth={1}
      borderRadius="xl"
      bg="white"
      boxShadow="xl"
      maxW="container.md"
      mx="auto"
    >
      <Heading size="lg" mb={6} textAlign="center" color="green.600">
        {id ? "수면 기록 수정" : "새로운 수면 기록"}
      </Heading>
      <Stack spacing={6}>
        <FormControl isRequired>
          <FormLabel display="flex" alignItems="center" gap={2}>
            <Icon as={FiMoon} />
            취침 시간
          </FormLabel>
          <Input
            type="datetime-local"
            name="sleepTime"
            value={formData.sleepTime}
            onChange={handleChange}
            bg="gray.50"
            borderColor="gray.300"
            _hover={{ borderColor: "orange.400" }}
            _focus={{ borderColor: "orange.400", boxShadow: "outline" }}
          />
          <FormHelperText>취침 시간을 선택해주세요</FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel display="flex" alignItems="center" gap={2}>
            <Icon as={FiSun} />
            기상 시간
          </FormLabel>
          <Input
            type="datetime-local"
            name="wakeTime"
            value={formData.wakeTime}
            onChange={handleChange}
            bg="gray.50"
            borderColor="gray.300"
            _hover={{ borderColor: "orange.400" }}
            _focus={{ borderColor: "orange.400", boxShadow: "outline" }}
          />
          <FormHelperText>기상 시간을 선택해주세요</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>수면 품질 (1-10)</FormLabel>
          <Select
            name="quality"
            value={formData.quality}
            onChange={handleChange}
            bg="gray.50"
            borderColor="gray.300"
            _hover={{ borderColor: "orange.400" }}
            _focus={{ borderColor: "orange.400", boxShadow: "outline" }}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} - {i < 3 ? "나쁨" : i < 5 ? "보통" : i < 8 ? "좋음" : "매우 좋음"}
              </option>
            ))}
          </Select>
          <FormHelperText>수면의 전반적인 품질을 평가해주세요</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>특이사항</FormLabel>
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="수면 중 특이사항을 기록해주세요"
            bg="gray.50"
            borderColor="gray.300"
            _hover={{ borderColor: "orange.400" }}
            _focus={{ borderColor: "orange.400", boxShadow: "outline" }}
            minH="120px"
          />
        </FormControl>

        <Button
          type="submit"
          size="lg"
          bgGradient="linear(to-r, green.500, green.500)"
          color="white"
          borderRadius="full"
          _hover={{
            bgGradient: "linear(to-r, green.500, green.500)",
            transform: "translateY(-2px)",
          }}
          _active={{
            bgGradient: "linear(to-r, green.700, green.600)",
          }}
          transition="all 0.2s"
          leftIcon={<FiSave />}
        >
          {id ? "수정하기" : "저장하기"}
        </Button>
      </Stack>
    </Box>
  );
};

export default SleepForm; 