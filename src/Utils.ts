export function unixToDate(unixTimestamp: number): string {
    // 13자리(밀리초) 타임스탬프인 경우 그대로 사용, 10자리(초) 타임스탬프는 1000을 곱함
    const timestamp = unixTimestamp.toString().length > 10 
        ? unixTimestamp 
        : unixTimestamp * 1000;
    
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function unixToDateWithTime(unixTime: number): string {
    // 13자리(밀리초) 타임스탬프인 경우 그대로 사용, 10자리(초) 타임스탬프는 1000을 곱함
    const timestamp = unixTime.toString().length > 10 
        ? unixTime 
        : unixTime * 1000;

    const date = new Date(timestamp);
    const formatted = date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Seoul'
    })
    .replace(/(\d+)\.\s(\d+)\.\s(\d+)\.\s/, '$1-$2-$3 ');
    
    return formatted;
}