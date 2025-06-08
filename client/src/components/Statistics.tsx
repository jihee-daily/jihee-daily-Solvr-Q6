import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart as ReactChartJS, Line, Bar, Radar } from "react-chartjs-2";
import { Box, Grid, Heading, VStack, Text } from "@chakra-ui/react";
import axios from "axios";
import { format, parseISO } from "date-fns";

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

interface SleepRecord {
  id: number;
  sleepTime: string;
  wakeTime: string;
  quality: number;
  notes: string;
}

const Statistics = () => {
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/sleep");
        setSleepRecords(response.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };
    fetchData();
  }, []);

  // 데이터 처리 함수들
  const processTimeData = () => {
    const sortedRecords = [...sleepRecords].sort((a, b) => 
      new Date(a.sleepTime).getTime() - new Date(b.sleepTime).getTime()
    );

    const timeToHours = (dateString: string) => {
      const date = parseISO(dateString);
      return date.getHours() + date.getMinutes() / 60;
    };

    return {
      labels: sortedRecords.map(record => format(parseISO(record.sleepTime), "MM/dd")),
      sleepTimes: sortedRecords.map(record => timeToHours(record.sleepTime)),
      wakeTimes: sortedRecords.map(record => timeToHours(record.wakeTime)),
    };
  };

  const processQualityData = () => {
    const sortedRecords = [...sleepRecords].sort((a, b) => 
      new Date(a.sleepTime).getTime() - new Date(b.sleepTime).getTime()
    );

    return {
      labels: sortedRecords.map(record => format(parseISO(record.sleepTime), "MM/dd")),
      qualities: sortedRecords.map(record => record.quality),
    };
  };

  const processSleepDurationData = () => {
    const sortedRecords = [...sleepRecords].sort((a, b) => 
      new Date(a.sleepTime).getTime() - new Date(b.sleepTime).getTime()
    );

    return {
      labels: sortedRecords.map(record => format(parseISO(record.sleepTime), "MM/dd")),
      durations: sortedRecords.map(record => {
        const sleep = new Date(record.sleepTime);
        const wake = new Date(record.wakeTime);
        return parseFloat(((wake.getTime() - sleep.getTime()) / (1000 * 60 * 60)).toFixed(1));
      }),
    };
  };

  const processDayOfWeekData = () => {
    const dayStats = new Array(7).fill(0).map(() => ({ 
      totalDuration: 0, 
      totalQuality: 0, 
      count: 0 
    }));

    sleepRecords.forEach(record => {
      const dayOfWeek = parseISO(record.sleepTime).getDay();
      const duration = (new Date(record.wakeTime).getTime() - new Date(record.sleepTime).getTime()) / (1000 * 60 * 60);
      
      dayStats[dayOfWeek].totalDuration += duration;
      dayStats[dayOfWeek].totalQuality += record.quality;
      dayStats[dayOfWeek].count += 1;
    });

    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    
    return {
      labels: daysOfWeek,
      avgDurations: dayStats.map(stat => parseFloat((stat.count ? stat.totalDuration / stat.count : 0).toFixed(1))),
      avgQualities: dayStats.map(stat => parseFloat((stat.count ? stat.totalQuality / stat.count : 0).toFixed(1))),
    };
  };

  // Floating Bar용 데이터 생성
  const processSleepRangeData = () => {
    const sortedRecords = [...sleepRecords].sort((a, b) => new Date(a.sleepTime).getTime() - new Date(b.sleepTime).getTime());
    const timeToHours = (dateString: string) => {
      const date = parseISO(dateString);
      return date.getHours() + date.getMinutes() / 60;
    };
    return {
      labels: sortedRecords.map(record => format(parseISO(record.sleepTime), "MM/dd")),
      ranges: sortedRecords.map(record => [timeToHours(record.sleepTime), timeToHours(record.wakeTime)]),
    };
  };

  const sleepRangeData = {
    labels: processSleepRangeData().labels,
    datasets: [
      {
        label: "수면 구간 (취침~기상)",
        data: processSleepRangeData().ranges,
        backgroundColor: "rgba(255, 159, 64, 0.7)",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const sleepRangeOptions = {
    indexAxis: 'x' as const,
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const [start, end] = context.raw;
            const hoursToTime = (hours: number) => `${String(Math.floor(hours)).padStart(2, '0')}:${String(Math.round((hours % 1) * 60)).padStart(2, '0')}`;
            return `수면: ${hoursToTime(start)} ~ ${hoursToTime(end)}`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 24,
        reverse: true,
        ticks: {
          callback: (value: any) => `${String(Math.floor(value)).padStart(2, '0')}:00`,
        },
        title: {
          display: true,
          text: '시간',
        },
      },
    },
  };

  // 차트 설정
  const hoursToTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };
  
  const timeChartData = {
    labels: processTimeData().labels,
    datasets: [
      {
        label: "취침 시간",
        data: processTimeData().sleepTimes,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "기상 시간",
        data: processTimeData().wakeTimes,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const qualityChartData = {
    labels: processQualityData().labels,
    datasets: [
      {
        label: "수면 품질",
        data: processQualityData().qualities,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  const durationChartData = {
    labels: processSleepDurationData().labels,
    datasets: [
      {
        label: "총 수면 시간 (시간)",
        data: processSleepDurationData().durations,
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        fill: true,
      },
    ],
  };

  const dayOfWeekChartData = {
    labels: processDayOfWeekData().labels,
    datasets: [
      {
        label: "평균 수면 시간",
        data: processDayOfWeekData().avgDurations,
        backgroundColor: "rgba(53, 162, 235, 0.7)",
        borderColor: "rgb(53, 162, 235)",
      },
      {
        label: "평균 수면 품질",
        data: processDayOfWeekData().avgQualities,
        backgroundColor: "rgba(255, 205, 86, 0.8)",
        borderColor: "rgba(255, 205, 86, 1)",
      },
    ],
  };

  const timeChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${hoursToTime(context.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        ticks: { callback: (value: any) => hoursToTime(value) },
      },
    },
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
  };
  
  // 혼합 차트 데이터 생성 (수면 품질: Bar, 총 수면 시간: Line)
  const processQualityAndDurationData = () => {
    const sortedRecords = [...sleepRecords].sort((a, b) => new Date(a.sleepTime).getTime() - new Date(b.sleepTime).getTime());
    return {
      labels: sortedRecords.map(record => format(parseISO(record.sleepTime), "MM/dd")),
      qualities: sortedRecords.map(record => record.quality),
      durations: sortedRecords.map(record => {
        const sleep = new Date(record.sleepTime);
        const wake = new Date(record.wakeTime);
        return parseFloat(((wake.getTime() - sleep.getTime()) / (1000 * 60 * 60)).toFixed(1));
      }),
    };
  };

  const qualityDurationChartData = {
    labels: processQualityAndDurationData().labels,
    datasets: [
      {
        type: 'line' as const,
        label: '총 수면 시간(시간)',
        data: processQualityAndDurationData().durations,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        yAxisID: 'y1',
        tension: 0.3,
        fill: false,
        pointRadius: 3,
      },
      {
        type: 'bar' as const,
        label: '수면 품질',
        data: processQualityAndDurationData().qualities,
        backgroundColor: 'rgba(255, 205, 86, 0.8)',
        yAxisID: 'y2',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const qualityDurationChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y1: {
        type: 'linear' as const,
        position: 'left' as const,
        title: { display: true, text: '총 수면 시간(시간)' },
        min: 0,
        max: 12,
        grid: { drawOnChartArea: true },
      },
      y2: {
        type: 'linear' as const,
        position: 'right' as const,
        title: { display: true, text: '수면 품질' },
        min: 0,
        max: 10,
        grid: { drawOnChartArea: false },
      },
      x: {
        title: { display: true, text: '날짜' },
      },
    },
  };

  if (sleepRecords.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Heading size="md">통계 데이터가 없습니다.</Heading>
        <Text>수면 기록을 추가하고 다시 방문해주세요.</Text>
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} maxW="container.xl" mx="auto">
      <VStack spacing={8}>
        <Heading size="lg" color="black.400">통계 보기</Heading>
        <Grid templateColumns={{ base: "1fr" }} gap={8} width="100%">
          <Box p={4} borderRadius="lg" boxShadow="base" bg="white">
            <Heading size="md" mb={4}>일별 취침/기상 시간</Heading>
            <Bar data={sleepRangeData} options={sleepRangeOptions} />
          </Box>
        </Grid>
        <Grid templateColumns={{ base: "1fr", md: "3fr 1fr" }} gap={8} width="100%">
          <Box p={4} borderRadius="lg" boxShadow="base" bg="white" gridColumn={{ md: "span 1" }}>
            <Heading size="md" mb={4}>일별 총 수면 시간 & 수면 품질</Heading>
            <ReactChartJS type="bar" data={qualityDurationChartData} options={qualityDurationChartOptions} />
          </Box>
          <Box p={4} borderRadius="lg" boxShadow="base" bg="white" gridColumn={{ md: "span 1" }}>
            <Heading size="md" mb={4}>요일별 평균 수면 통계</Heading>
            <Radar data={dayOfWeekChartData} options={commonOptions} />
          </Box>
        </Grid>
      </VStack>
    </Box>
  );
};

export default Statistics; 