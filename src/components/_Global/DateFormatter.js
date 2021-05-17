export default function DateFormatter(num) {
    // January 1, 1970 - based on this original date
    let year = Math.floor(num / (1000 * 60 * 60 * 24 * 365));
    let remainderYr = num - (year * 1000 * 60 * 60 * 24 * 365);
    let days = Math.floor(remainderYr / (1000 * 60 * 60 * 24));

    let daysArr = [
        { month: 'Jan', days: 31 },
        { month: 'Feb', days: 28 },
        { month: 'Mar', days: 31 },
        { month: 'Apr', days: 30 },
        { month: 'May', days: 31 },
        { month: 'Jun', days: 30 },
        { month: 'Jul', days: 31 },
        { month: 'Aug', days: 31 },
        { month: 'Sep', days: 30 },
        { month: 'Oct', days: 31 },
        { month: 'Nov', days: 30 },
        { month: 'Dec', days: 31 }
    ]

    let leapDays = Math.floor(year / 4);
    days -= leapDays;
    days -= 1;

    let month;
    for (let index = 0; index < daysArr.length; index++) {
        let item = daysArr[index];
        if (days > item.days) {
            days -= item.days;
        } else {
            month = daysArr[index].month;
            break;
        }
    }

    year += 1970;
    let finalDate = days + ' ' + month + ' ' + year;
    return finalDate;
}