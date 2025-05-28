export function formatTimestamp(timestamp: any, showYear: boolean = false){
    const date = new Date(timestamp); 
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
  
    if(showYear){
        return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    }else{
        return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    }
}

export function formatDate(timestamp:any) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return {
        year,
        date: `${month} ${day}`,
        time: `${hours}:${minutes}`
    }
  }


export function formatNumber(num:Number) {
    if(!num){
        return num;
    }
    return num.toLocaleString('en-US');
}

export function formatCountdown(countdownSeconds:number) {
    const minutes = Math.floor(countdownSeconds / 60);
    const seconds = countdownSeconds % 60;
  
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
}


export function timestampToUTCString(timestamp:any) {
    const date = new Date(timestamp);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getUTCMonth()];
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    // ${hours}:${minutes}
    return `${month} ${day}`;
}


export function padZero(num:number) {
    let numStr = num.toString();
    while (numStr.length < 5) {
      numStr = "0" + numStr;
    }
    return numStr;
}



export function isMobile(){  
    const userAgentInfo = navigator.userAgent;
    const Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];  
    let flag = false;  
    for (let v = 0; v < Agents.length; v++) {  
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = true; break; }  
    }  
    return flag;  
}