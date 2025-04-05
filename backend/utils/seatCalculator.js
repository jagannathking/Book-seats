const TOTAL_SEATS = 80;
const SEATS_PER_FULL_ROW = 7;
const LAST_ROW_NUMBER = 12;
const LAST_ROW_SEATS = [78, 79, 80];


function getRow(seatNumber) {
    if (seatNumber < 1 || seatNumber > TOTAL_SEATS) {
        return null; 
    }
    if (seatNumber >= LAST_ROW_SEATS[0]) { // Check if it's in the last row
        return LAST_ROW_NUMBER;
    }
    // For rows 1-11 (7 seats each)
    return Math.ceil(seatNumber / SEATS_PER_FULL_ROW);
}


function getSeatsInRow(rowNumber) {
    if (rowNumber < 1 || rowNumber > LAST_ROW_NUMBER) {
        return []; 
    }
    if (rowNumber === LAST_ROW_NUMBER) {
        return [...LAST_ROW_SEATS]; 
    }
    // Calculate for rows 1-11
    const startSeat = (rowNumber - 1) * SEATS_PER_FULL_ROW + 1;
    const endSeat = startSeat + SEATS_PER_FULL_ROW - 1;
    const seats = [];
    for (let i = startSeat; i <= endSeat; i++) {
        seats.push(i);
    }
    return seats;
}


function calculateAvailableSeats(bookedSeatNumbers) {
    const bookedSet = new Set(bookedSeatNumbers); 
    const available = [];
    for (let i = 1; i <= TOTAL_SEATS; i++) {
        if (!bookedSet.has(i)) {
            available.push(i);
        }
    }
    return available; 
}


function findContiguousSeatsInRows(availableSeats, numSeats) {
    const availableSet = new Set(availableSeats); 

    for (let row = 1; row <= LAST_ROW_NUMBER; row++) {
        const seatsInThisRow = getSeatsInRow(row);

        // Optimization: Skip row if it doesn't even have numSeats total
        if (seatsInThisRow.length < numSeats) {
            continue;
        }

        for (let i = 0; i <= seatsInThisRow.length - numSeats; i++) {
            let isBlockAvailable = true;
            const potentialBlock = [];
            // Check if the next 'numSeats' starting from seatsInThisRow[i] are available
            for (let j = 0; j < numSeats; j++) {
                const seatToCheck = seatsInThisRow[i + j];
                potentialBlock.push(seatToCheck);
                if (!availableSet.has(seatToCheck)) {
                    isBlockAvailable = false;
                    break; // This block won't work, move to next starting seat
                }
            }

            if (isBlockAvailable) {
                return potentialBlock; // Found a contiguous block in this row!
            }
        }
    }

    return null; 
}


function getFirstAvailableSeats(availableSeats, numSeats) {
    // Assumes availableSeats is already sorted numerically
    // Takes the first 'numSeats' elements
    return availableSeats.slice(0, numSeats);
}


module.exports = {
    getRow,
    getSeatsInRow,
    calculateAvailableSeats,
    findContiguousSeatsInRows,
    getFirstAvailableSeats,
    TOTAL_SEATS 
};