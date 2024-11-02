function toBase12(num) {
    if (num === 0) return "0";
    const digits = "0123456789AB";
    let result = "";
    let isNegative = num < 0;
    num = Math.abs(num);
    
    // 整数部分の処理
    let intPart = Math.floor(num);
    if (intPart === 0) result = "0";
    while (intPart > 0) {
        result = digits[intPart % 12] + result;
        intPart = Math.floor(intPart / 12);
    }
    
    // 小数部分の処理
    let fracPart = num - Math.floor(num);
    if (fracPart > 0) {
        result += ".";
        for (let i = 0; i < 3; i++) { // 小数点以下3桁まで
            fracPart *= 12;
            result += digits[Math.floor(fracPart)];
            fracPart -= Math.floor(fracPart);
        }
    }
    
    return isNegative ? "-" + result : result;
}

function createClock() {
    // カウンター表示部分を追加
    const counterDiv = document.createElement('div');
    counterDiv.className = 'counter-display';
    counterDiv.style.textAlign = 'center';
    counterDiv.style.marginTop = '16px';
    counterDiv.style.fontSize = '18px';
    counterDiv.innerHTML = `
        <div class="counter-row">
            <div class="counter-label">標準時間(10進)：</div>
            <div class="counter-value"><span id="standard-decimal">0</span> 秒</div>
        </div>
        <div class="counter-row">
            <div class="counter-label">標準時間(12進)：</div>
            <div class="counter-value"><span id="standard-base12">0</span> 秒</div>
        </div>
        <div class="counter-row">
            <div class="counter-label">新時間(10進)：</div>
            <div class="counter-value"><span id="new-decimal">0</span> 新秒</div>
        </div>
        <div class="counter-row">
            <div class="counter-label">新時間(12進)：</div>
            <div class="counter-value"><span id="new-base12">0</span> 新秒</div>
        </div>
    `;

    // スタイルを追加
    const style = document.createElement('style');
    style.textContent = `
        .counter-display {
            font-family: monospace;
            border: 2px solid black;
            padding: 10px;
            margin: 16px auto;
            width: fit-content;
            min-width: 300px;
            background: white;
        }
        .counter-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            padding: 2px 10px;
        }
        .counter-label {
            margin-right: 15px;
        }
        .counter-value {
            min-width: 150px;
            text-align: left;
        }
    `;
    document.head.appendChild(style);

    const clock = document.getElementById('clock');
    document.querySelector('.container').insertBefore(counterDiv, document.getElementById('newminutes-display'));
    
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
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const msSinceStartOfDay = now - startOfDay;
    
    // 標準時間（秒）
    const totalStandardSeconds = msSinceStartOfDay / 1000;
    
    // 新時間（新秒）
    const totalNewSeconds = totalStandardSeconds * (24/25);
    
    // カウンター更新
    document.getElementById('standard-decimal').textContent = totalStandardSeconds.toFixed(3);
    document.getElementById('standard-base12').textContent = toBase12(totalStandardSeconds);
    document.getElementById('new-decimal').textContent = totalNewSeconds.toFixed(3);
    document.getElementById('new-base12').textContent = toBase12(totalNewSeconds);

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

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const digitalClock = document.getElementById('digital-clock');
    digitalClock.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const hands = createClock();

setInterval(updateClock, 10);
updateClock();
