//"https://www.dropbox.com/scl/fi/h69ggmddr2i5alnvqa5z6/.PDF?rlkey=e2hs394mlrhihgh7178u7v46f&st=938x1cdv&dl=0"
function toBase12(num) {
    if (num === 0) return "0";
    const digits = "0123456789AB";
    let result = "";
    while (num > 0) {
        result = digits[num % 12] + result;
        num = Math.floor(num / 12);
    }
    return result;
}

function createClock() {
    const clock = document.getElementById('clock');
    
    for (let i = 0; i < 36; i++) {
        const angle = (i * 360) / 36;
        const marker = document.createElement('div');
        marker.className = 'hour-marker';
        marker.style.transform = `rotate(${angle}deg)`;
        
        if (i % 6 === 0) {
            const line = document.createElement('div');
            line.className = 'hour-line';
            
            const number = document.createElement('div');
            number.className = 'hour-number';
            number.style.transform = `rotate(-${angle}deg)`;
            number.textContent = toBase12(i);
            
            marker.appendChild(line);
            marker.appendChild(number);
        }
        
        clock.appendChild(marker);
    }

    for (let i = 0; i < 48; i++) {
        const angle = i * 7.5;
        const marker = document.createElement('div');
        marker.className = 'second-marker';
        marker.style.transform = `rotate(${angle}deg)`;
        
        const line = document.createElement('div');
        line.className = 'second-line';
        
        marker.appendChild(line);
        clock.appendChild(marker);
    }

    const hourHand = document.createElement('div');
    hourHand.className = 'hand hour-hand';
    
    const minuteHand = document.createElement('div');
    minuteHand.className = 'hand minute-hand';
    
    const secondHand = document.createElement('div');
    secondHand.className = 'hand second-hand';
    
    const centerDot = document.createElement('div');
    centerDot.className = 'center-dot';
    
    clock.appendChild(hourHand);
    clock.appendChild(minuteHand);
    clock.appendChild(secondHand);
    clock.appendChild(centerDot);
    
    return { hourHand, minuteHand, secondHand };
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
      
    const totalStandardSeconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    
    const totalNewSeconds = totalStandardSeconds * (24 / 25);
    
    const totalNewMinutes = totalNewSeconds / 48;
    
    const totalNewHours = totalNewMinutes / 48;

    const secondAngle = (totalNewSeconds % 48) * (360 / 48);
    const minuteAngle = (totalNewMinutes % 48) * (360 / 48);
    const hourAngle = (totalNewHours % 36) * (360 / 36);

    hands.hourHand.style.transform = 
        `translate(-50%, -100%) rotate(${hourAngle}deg)`;
    hands.minuteHand.style.transform = 
        `translate(-50%, -100%) rotate(${minuteAngle}deg)`;
    hands.secondHand.style.transform = 
        `translate(-50%, -100%) rotate(${secondAngle}deg)`;
    
    const displayMinutes = Math.floor(totalNewMinutes);
    const displaySeconds = Math.floor(totalNewSeconds % 48);
    const display = document.getElementById('newminutes-display');
    display.textContent = `${toBase12(displayMinutes).padStart(4, '0')}:${toBase12(displaySeconds).padStart(2, '0')}`;

    const digitalClock = document.getElementById('digital-clock');
    digitalClock.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const hands = createClock();


setInterval(updateClock, 50);
updateClock();

