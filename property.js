document.addEventListener('DOMContentLoaded', () => {
    const checkInInput = document.getElementById('checkInInput');
    const checkOutInput = document.getElementById('checkOutInput');
    const calendarContainer = document.getElementById('calendarContainer');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarGrid = document.querySelector('.calendar-grid');
    const clearDatesBtn = document.querySelector('.calendar-clear');
    const closeCalendarBtn = document.querySelector('.calendar-close');

    let currentDate = new Date();
    let displayedMonth = new Date(2025, 4); // May 2025
    let selectedCheckIn = new Date(2025, 4, 3); // May 3, 2025
    let selectedCheckOut = new Date(2025, 4, 8); // May 8, 2025
    let selecting = 'checkin'; // or 'checkout'

    function formatDate(date) {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    function updateInputs() {
        if (selectedCheckIn) {
            checkInInput.querySelector('.date-value').textContent = formatDate(selectedCheckIn);
        }
        if (selectedCheckOut) {
            checkOutInput.querySelector('.date-value').textContent = formatDate(selectedCheckOut);
        }
    }

    function generateCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        
        currentMonthElement.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        // Clear existing dates
        const existingDates = calendarGrid.querySelectorAll('.calendar-date');
        existingDates.forEach(date => date.remove());

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-date';
            calendarGrid.appendChild(emptyCell);
        }

        // Add dates
        for (let i = 1; i <= lastDate; i++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'calendar-date';
            const currentDateObj = new Date(year, month, i);
            
            // Disable past dates
            if (currentDateObj < new Date()) {
                dateCell.classList.add('disabled');
            } else {
                dateCell.addEventListener('click', () => handleDateClick(currentDateObj));
                
                // Check if date is selected or in range
                if (selectedCheckIn && selectedCheckOut) {
                    if (currentDateObj >= selectedCheckIn && currentDateObj <= selectedCheckOut) {
                        dateCell.classList.add('in-range');
                    }
                    if (currentDateObj.getTime() === selectedCheckIn.getTime()) {
                        dateCell.classList.add('range-start');
                    }
                    if (currentDateObj.getTime() === selectedCheckOut.getTime()) {
                        dateCell.classList.add('range-end');
                    }
                }
            }
            
            dateCell.textContent = i;
            calendarGrid.appendChild(dateCell);
        }
    }

    function handleDateClick(date) {
        if (selecting === 'checkin') {
            selectedCheckIn = date;
            selecting = 'checkout';
            if (selectedCheckOut && selectedCheckOut <= selectedCheckIn) {
                selectedCheckOut = null;
            }
        } else {
            if (date < selectedCheckIn) {
                selectedCheckIn = date;
            } else {
                selectedCheckOut = date;
                calendarContainer.style.display = 'none';
            }
            selecting = 'checkin';
        }
        
        updateInputs();
        generateCalendar(displayedMonth);
    }

    // Event Listeners
    checkInInput.addEventListener('click', () => {
        calendarContainer.style.display = 'block';
        selecting = 'checkin';
    });

    checkOutInput.addEventListener('click', () => {
        calendarContainer.style.display = 'block';
        selecting = 'checkout';
    });

    prevMonthBtn.addEventListener('click', () => {
        displayedMonth.setMonth(displayedMonth.getMonth() - 1);
        generateCalendar(displayedMonth);
    });

    nextMonthBtn.addEventListener('click', () => {
        displayedMonth.setMonth(displayedMonth.getMonth() + 1);
        generateCalendar(displayedMonth);
    });

    clearDatesBtn.addEventListener('click', () => {
        selectedCheckIn = null;
        selectedCheckOut = null;
        updateInputs();
        generateCalendar(displayedMonth);
    });

    closeCalendarBtn.addEventListener('click', () => {
        calendarContainer.style.display = 'none';
    });

    // Close calendar when clicking outside
    document.addEventListener('click', (e) => {
        if (!calendarContainer.contains(e.target) && 
            !checkInInput.contains(e.target) && 
            !checkOutInput.contains(e.target)) {
            calendarContainer.style.display = 'none';
        }
    });

    // Initialize calendar
    generateCalendar(displayedMonth);
    updateInputs();
    
    // Guest dropdown functionality
    const guestsDropdown = document.querySelector('.guests-dropdown');
    const guestSelectorDropdown = document.querySelector('.guest-selector-dropdown');
    const guestsDisplay = document.getElementById('guests-display');
    const closeBtn = document.querySelector('.close-btn');

    // Initialize counts
    const counts = {
        adults: 2,
        children: 1,
        infants: 1,
        pets: 0
    };

    // Update display text
    function updateGuestsDisplay() {
        const totalGuests = counts.adults + counts.children;
        let displayText = `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}`;
        
        if (counts.infants > 0) {
            displayText += `, ${counts.infants} infant${counts.infants !== 1 ? 's' : ''}`;
        }
        if (counts.pets > 0) {
            displayText += `, ${counts.pets} pet${counts.pets !== 1 ? 's' : ''}`;
        }
        
        guestsDisplay.textContent = displayText;
    }

    // Setup button handlers
    ['adults', 'children', 'infants', 'pets'].forEach(type => {
        const minusBtn = document.getElementById(`${type}-minus`);
        const plusBtn = document.getElementById(`${type}-plus`);
        const countDisplay = document.getElementById(`${type}-count`);
        
        if (minusBtn && plusBtn && countDisplay) {
            // Initialize count display
            countDisplay.textContent = counts[type];
            minusBtn.disabled = counts[type] === 0;

            minusBtn.addEventListener('click', () => {
                if (counts[type] > 0) {
                    counts[type]--;
                    countDisplay.textContent = counts[type];
                    minusBtn.disabled = counts[type] === 0;
                    updateGuestsDisplay();
                }
            });

            plusBtn.addEventListener('click', () => {
                // Maximum guests check (15 total, excluding infants)
                const totalGuests = counts.adults + counts.children + (type !== 'infants' ? 1 : 0);
                if ((type === 'adults' || type === 'children') && totalGuests > 15) {
                    return;
                }
                
                counts[type]++;
                countDisplay.textContent = counts[type];
                minusBtn.disabled = false;
                updateGuestsDisplay();
            });
        }
    });

    // Toggle dropdown
    guestsDropdown.addEventListener('click', (e) => {
        if (!guestSelectorDropdown.contains(e.target)) {
            guestSelectorDropdown.classList.toggle('show');
        }
    });

    // Close button functionality
    closeBtn.addEventListener('click', () => {
        guestSelectorDropdown.classList.remove('show');
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (!guestsDropdown.contains(e.target)) {
            guestSelectorDropdown.classList.remove('show');
        }
    });

    // Initial display update
    updateGuestsDisplay();
});