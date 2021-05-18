import React, { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import axios from 'axios';
import Loading from '../../_Global/Loading';
import Footer from '../../_Global/Footer';

export default function Status(props) {
    const { checkHeight } = props;
    const [orders, updateOrders] = useState([]);
    const [isLoaded, updateIsLoaded] = useState(false);
    const [filters, updateFilters] = useState(['Today', 'Date Period']);
    const [statuses, updateStatuses] = useState([{ color: '#008D28', label: 'Open' }, { color: '#FF9432', label: 'In Progress' }, { color: '#f44336', label: 'Fulfilled' }]);
    const [selectedFilter, updateSelectedFilter] = useState('Today');
    const [filteredStatuses, updateFilteredStatuses] = useState(['Open', 'In Progress', 'Fulfilled']);

    useEffect(() => {
        getOrders();
        // eslint-disable-next-line
    }, [filteredStatuses]);

    const getOrders = async () => {
        let { data } = await axios.get('/api/orders');
        handleFilter(data);
    }

    const handleFilter = async (orderData) => {
        let data = await orderData.filter(order => filteredStatuses.includes(order.status));
        await updateOrders(data);
        await updateIsLoaded(true);
    }

    const mapFilters = () => {
        return (
            <div className="filters-container container">
                <h3 className="section-label">Filters:</h3>
                <div className="filter-btn-container">
                    {filters.map((filter, index) => {
                        return (
                            <button
                                key={filter + '-' + index}
                                onClick={() => handleFilterChange(filter)}
                                className={`filter-btn ${filter === selectedFilter && 'selected'}`}
                            >
                                {filter}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

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

    const handleFilterChange = (selected) => {
        updateSelectedFilter(selected);
    }

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
                {mapFilters()}
                {mapStatuses()}
                {mapOrders()}
                <Footer />
            </div>
        </Loading>
    )
}