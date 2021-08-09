import moment from "moment";

export default {
    /**
     * 
     * @param {Date} time 
     * @param {Date} base 
     */
    relative(time, base) {
        let mTime = moment(time);
        let mBase = moment(base);

        var diff = moment.duration(mBase.diff(moment(mTime)));
        
        if(diff.asMinutes() < 1)
            return "방금 전";
        
        if(diff.asHours() < 1)
            return `${Math.floor(diff.asMinutes())}분 전`;

        mTime = moment({year: mTime.year(), month: mTime.month(), date: mTime.date()});
        mBase = moment({year: mBase.year(), month: mBase.month(), date: mBase.date()});
        var dateDiff = moment.duration(mBase.diff(mTime));

        if(diff.asHours() < 12 || dateDiff.asMilliseconds() == 0)
            return `${Math.floor(diff.asHours())}시간 전`;

        if(dateDiff.asDays() == 1)
            return "어제";
        if(dateDiff.asDays() == 2)
            return "그저께";
        if(dateDiff.asDays() < 7)
            return `${dateDiff.asDays()}일 전`;

        var weeks = moment.duration(dateDiff.asMilliseconds());
        weeks.add(mTime.day() - mBase.day(), 'days');

        if(dateDiff.asDays() < weeks.asDays() - 1)
            weeks.subtract(7, 'days');
        
        var months = (mBase.year() - mTime.year()) * 12 + mBase.month() - mTime.month();
        if(mTime.date() - mBase.date() >= 7)
            months--;

        console.log(weeks);
        if(months == 0 || dateDiff.asDays() < 25)
            return `${weeks.asDays() / 7}주 전`;
        
        if(months < 12)
            return `${months}개월 전`;

        var years = mBase.year() - mTime.year();
        if(mTime.month() - mBase.month() > 3)
            years--;
        
        return `${years}년 전`;
    },

    linguistic(time) {
        return moment(time).locale("ko").format("YYYY년 M월 D일 A h시 m분");
    }
};