import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const FoodTypeGraph = () => {
    const [dateRange, setDateRange] = useState('Today');
    const [loading, setLoading] = useState(false);
  
    const handleDateRangeChange = (range) => {
      setDateRange(range);
      fetchData(range);
    };
  
    const handleReload = () => {
      setLoading(true);
      fetchData(dateRange);
      setTimeout(() => setLoading(false), 1000);
    };
  
    const fetchData = (range) => {
      console.log('Fetching data for range:', range);
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
                            <li>
                                <a href="javascript:void(0);" 
                                   className="dropdown-item d-flex align-items-center"
                                   onClick={() => handleDateRangeChange('Today')}>
                                    Today
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0);" 
                                   className="dropdown-item d-flex align-items-center"
                                   onClick={() => handleDateRangeChange('Yesterday')}>
                                    Yesterday
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0);" 
                                   className="dropdown-item d-flex align-items-center"
                                   onClick={() => handleDateRangeChange('Last 7 Days')}>
                                    Last 7 Days
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0);" 
                                   className="dropdown-item d-flex align-items-center"
                                   onClick={() => handleDateRangeChange('Last 30 Days')}>
                                    Last 30 Days
                                </a>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <a href="javascript:void(0);" 
                                   className="dropdown-item d-flex align-items-center"
                                   onClick={() => handleDateRangeChange('Current Month')}>
                                    Current Month
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0);" 
                                   className="dropdown-item d-flex align-items-center"
                                   onClick={() => handleDateRangeChange('Last Month')}>
                                    Last Month
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
                        <Bar dataKey="Veg" stackId="a" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Non-Veg" stackId="a" fill="#ff7f50" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Vegan" stackId="a" fill="#8c57ff" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Eggs" stackId="a" fill="#ffd700" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default FoodTypeGraph