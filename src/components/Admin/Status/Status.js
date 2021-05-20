import React, { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import axios from 'axios';
import Loading from '../../_Global/Loading';
import Footer from '../../_Global/Footer';

export default function Status(props) {
    const { checkHeight } = props;
    const [orders, updateOrders] = useState([]);
    const [isLoaded, updateIsLoaded] = useState(false);
    // const filters = ['Today', 'Date Period'];
    // const filters = ['Today'];
    const statuses = [{ color: '#008D28', label: 'Open' }, { color: '#FF9432', label: 'In Progress' }, { color: '#f44336', label: 'Fulfilled' }];
    // const [selectedFilter, updateSelectedFilter] = useState('Today');
    const [filteredStatuses, updateFilteredStatuses] = useState(['Open', 'In Progress', 'Fulfilled']);

    useEffect(() => {
        getOrders();
        // eslint-disable-next-line
    }, [filteredStatuses]);

    const getOrders = async () => {
        let date = getDate();
        let start = new Date(date + 'T00:00:00.000Z').getTime().toString();
        let end = new Date(date + 'T23:59:59.999Z').getTime().toString();
        let { data } = await axios.get(`/api/orders?start=${start}&end=${end}`);
        handleFilter(data);
    }

    const handleFilter = async (orderData) => {
        let data = await orderData.filter(order => filteredStatuses.includes(order.status));
        await updateOrders(data);
        await updateIsLoaded(true);
    }

    const getDate = () => {
        let date = new Date();
        let month = date.getMonth();
        let year = date.getFullYear();
        let day = date.getDate();
        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        return year + '-' + month + '-' + day;
    }

    // const mapFilters = () => {
    //     return (
    //         <div className="filters-container container">
    //             <h3 className="section-label">Filters:</h3>
    //             <div className="filter-btn-container">
    //                 {filters.map((filter, index) => {
    //                     return (
    //                         <button
    //                             key={filter + '-' + index}
    //                             onClick={() => handleFilterChange(filter)}
    //                             className={`filter-btn ${filter === selectedFilter && 'selected'}`}
    //                         >
    //                             {filter}
    //                         </button>
    //                     )
    //                 })}
    //             </div>
    //         </div>
    //     )
    // }

    // const showPeriod = () => {
    //     return (
    //         <div className="date-period-container container align-ctr">
    //             <div className="start-date-container">
    //                 <h3 className="section-label">Start Date:</h3>
    //                 <input type="date" name="start-date" id="start-date" value={startDate} onChange={(e) => handleStartDate(e.target.value)} />
    //             </div>
    //             <div className="dash-container flex-all-ctr">
    //                 <p>-</p>
    //             </div>
    //             <div className="end-date-container">
    //                 <h3 className="section-label">End Date:</h3>
    //                 <input type="date" name="end-date" id="end-date" value={endDate} onChange={(e) => handleEndDate(e.target.value)} />
    //             </div>
    //         </div>
    //     )
    // }

    const mapStatuses = () => {
        return (
            <div className="statuses-container container">
                <h3 className="section-label">Showing:</h3>
                <div className="status-btn-container flex-btwn">
                    {statuses.map((status, index) => {
                        const { color, label } = status;
                        const included = filteredStatuses.includes(label);
                        return (
                            <button
                                key={label + '-' + index}
                                className={`status-btn align-ctr ${!included && 'not-included'}`}
                                onClick={() => handleStatusSelection(label, included)}
                            >
                                <div className="status-circle" style={{ background: color }}></div>
                                <span className="equal">=</span>
                                <span className="status-name">{label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    const mapOrders = () => {
        if (orders.length > 0) {
            return (
                <div className="order-cards-container container">
                    <h3 className="section-label">Orders:</h3>
                    {orders.map(order => {
                        return (
                            <OrderCard
                                key={order.order_id}
                                order={order}
                                updateOrder={updateOrder}
                            />
                        )
                    })}
                </div>
            )
        } else {
            return (
                <div className="empty-orders-container container">
                    <h3 className="section-label">Orders:</h3>
                    <p className="flex-ctr">There are no orders to display.</p>
                </div>
            )
        }
    }

    // const handleFilterChange = (selected) => {
    //     updateSelectedFilter(selected);
    // }

    const handleStatusSelection = (filter, included) => {
        let selected = [...filteredStatuses];
        if (included) {
            let index = selected.findIndex(label => label === filter);
            if (index > -1) {
                selected.splice(index, 1);
            }
        } else {
            selected.push(filter);
        }
        updateFilteredStatuses(selected);
    }

    const updateOrder = async (newOrder) => {
        const { order_id } = newOrder;
        const copy = [...orders];
        let index = copy.findIndex(item => item.order_id === order_id);
        if (index > -1) copy[index] = newOrder
        await updateOrders(copy);
        await handleFilter(copy);
    }

    return (
        <Loading loaded={isLoaded} checkHeight={checkHeight} image={'.top-section'}>
            <div className="status-page align-ctr col">
                <div className="top-section"></div>
                {/* {mapFilters()} */}
                {/* {selectedFilter === 'Date Period' && showPeriod()} */}
                {mapStatuses()}
                {mapOrders()}
                <Footer />
            </div>
        </Loading>
    )
}