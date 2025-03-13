import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FoodTypeGraph = () => {
    const [dateRange, setDateRange] = useState('Today');
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
  
    const formatDate = (date) => {
        if (!date) return '';
        const day = date.getDate().toString().padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const handleDateRangeChange = (range) => {
        setDateRange(range);
        setShowDatePicker(range === 'Custom Range');
        if (range !== 'Custom Range') {
            fetchData(range);
        }
    };

    const handleReload = () => {
        setLoading(true);
        fetchData(dateRange);
        setTimeout(() => setLoading(false), 1000);
    };

    const fetchData = (range) => {
        if (range === 'Custom Range' && startDate && endDate) {
            console.log('Fetching data for custom range:', startDate, endDate);
        } else {
            console.log('Fetching data for range:', range);
        }
    };

    const handleCustomDateSelect = () => {
        if (startDate && endDate) {
            setDateRange(`${formatDate(startDate)} - ${formatDate(endDate)}`);
            setShowDatePicker(false);
            fetchData('Custom Range');
        }
    };
    const data = [
        { week: "Week 1", Veg: 40, "Non-Veg": 30, Vegan: 20, Eggs: 10 },
        { week: "Week 2", Veg: 35, "Non-Veg": 25, Vegan: 15, Eggs: 20 },
        { week: "Week 3", Veg: 50, "Non-Veg": 20, Vegan: 10, Eggs: 20 },
        { week: "Week 4", Veg: 45, "Non-Veg": 35, Vegan: 25, Eggs: 15 },
    ];

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-md-center align-items-start">
                <h5 className="card-title mb-0">Food Type Analysis</h5>
                <div className="d-flex align-items-center gap-3">
                
                <div className="dropdown">
                        <button
                            type="button"
                            className="btn btn-outline-primary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fas fa-calendar me-2"></i>
                            {dateRange}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Current Month', 'Last Month'].map((range) => (
                                <li key={range}>
                                    <a href="javascript:void(0);"
                                        className="dropdown-item d-flex align-items-center"
                                        onClick={() => handleDateRangeChange(range)}>
                                        {range}
                                    </a>
                                </li>
                            ))}
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <a href="javascript:void(0);"
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={() => handleDateRangeChange('Custom Range')}>
                                    Custom Range
                                </a>
                            </li>
                        </ul>
                    </div>

                    <button
                        type="button"
                        className={`btn btn-icon p-0 ${loading ? 'disabled' : ''}`}
                        onClick={handleReload}
                        disabled={loading}
                    >
                        <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
                    </button>
                </div>
            </div>

            {showDatePicker && (
                <div className="card-body">
                    <div className="d-flex flex-column gap-2">
                        <label>Select Date Range:</label>
                        <div className="d-flex gap-2">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                maxDate={new Date()}
                                placeholderText="DD MMM YYYY"
                                className="form-control"
                                dateFormat="dd MMM yyyy"
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                maxDate={new Date()}
                                placeholderText="DD MMM YYYY"
                                className="form-control"
                                dateFormat="dd MMM yyyy"
                            />
                        </div>
                        <button className="btn btn-primary mt-2" onClick={handleCustomDateSelect} disabled={!startDate || !endDate}>
                            Apply
                        </button>
                    </div>
                </div>
            )}
            <div className="card-body">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="week" stroke="#433c50" />
                        <YAxis stroke="#433c50" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#fff',
                                border: '1px solid #8c57ff',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="Veg" stackId="a" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Non-Veg" stackId="a" fill="#d32f2f" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Vegan" stackId="a" fill="#FFBF00" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Eggs" stackId="a" fill="#9e9e9e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default FoodTypeGraph