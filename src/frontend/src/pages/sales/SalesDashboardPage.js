import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  MonetizationOn as RevenueIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  TrendingUp as GrowthIcon,
  BarChart as ChartIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { LineChart, BarChart, PieChart } from '@mui/x-charts';
import { DatePicker } from '@mui/x-date-pickers';

export default function SalesDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());

  // Mock data - replace with API calls
  const [dashboardData, setDashboardData] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    growthRate: 0,
    revenueTrend: [],
    orderTrend: [],
    customerSegments: [],
    topProducts: []
  });

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setDashboardData({
        revenue: 125000,
        orders: 42,
        customers: 18,
        growthRate: 12.5,
        revenueTrend: [
          { date: '2025-04-01', value: 35000 },
          { date: '2025-04-08', value: 42000 },
          { date: '2025-04-15', value: 38000 },
          { date: '2025-04-22', value: 45000 },
          { date: '2025-04-29', value: 48000 }
        ],
        orderTrend: [
          { date: '2025-04-01', value: 8 },
          { date: '2025-04-08', value: 10 },
          { date: '2025-04-15', value: 7 },
          { date: '2025-04-22', value: 12 },
          { date: '2025-04-29', value: 15 }
        ],
        customerSegments: [
          { label: 'Retail', value: 12 },
          { label: 'Wholesale', value: 4 },
          { label: 'Government', value: 2 }
        ],
        topProducts: [
          { label: 'Tent Pro', value: 28 },
          { label: 'Backpack', value: 22 },
          { label: 'Sleeping Bag', value: 18 },
          { label: 'Camp Stove', value: 15 },
          { label: 'Water Filter', value: 12 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [timeRange, startDate, endDate]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
    // Adjust dates based on time range
    const now = new Date();
    let newStartDate = new Date();
    
    switch(event.target.value) {
      case 'week':
        newStartDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        newStartDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        newStartDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        newStartDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        newStartDate = startDate;
    }
    
    setStartDate(newStartDate);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Sales Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Time Range"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          {timeRange === 'custom' && (
            <>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </>
          )}
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <RevenueIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">Total Revenue</Typography>
                  </Box>
                  <Typography variant="h4">{formatCurrency(dashboardData.revenue)}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {dashboardData.growthRate > 0 ? '+' : ''}{dashboardData.growthRate}% from last period
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <OrdersIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">Total Orders</Typography>
                  </Box>
                  <Typography variant="h4">{dashboardData.orders}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CustomersIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">Active Customers</Typography>
                  </Box>
                  <Typography variant="h4">{dashboardData.customers}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <GrowthIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">Growth Rate</Typography>
                  </Box>
                  <Typography variant="h4">{dashboardData.growthRate}%</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Revenue Trend Chart */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Revenue Trend</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                <LineChart
                  xAxis={[{
                    data: dashboardData.revenueTrend.map(item => new Date(item.date)),
                    scaleType: 'time',
                    label: 'Date'
                  }]}
                  series={[{
                    data: dashboardData.revenueTrend.map(item => item.value),
                    label: 'Revenue',
                    area: true,
                    showMark: true
                  }]}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Bottom Row */}
          <Grid container spacing={3}>
            {/* Order Trend */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ChartIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Order Trend</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <BarChart
                      xAxis={[{
                        data: dashboardData.orderTrend.map(item => new Date(item.date)),
                        scaleType: 'time',
                        label: 'Date'
                      }]}
                      series={[{
                        data: dashboardData.orderTrend.map(item => item.value),
                        label: 'Orders'
                      }]}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Customer Segments */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ChartIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Customer Segments</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <PieChart
                      series={[{
                        data: dashboardData.customerSegments,
                        innerRadius: 30,
                        outerRadius: 100,
                        paddingAngle: 5,
                        cornerRadius: 5,
                      }]}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}