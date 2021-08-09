export default {

    briefNumber(n) {
        if(n < 10000)
            return n.toString();
        else if(n < 100000 && n / 1000 % 10000 >= 1)
            return (n / 10000).toFixed(1) + '만';
        else if(n < 100000000)
            return Math.floor(n / 10000) + '만';
        else if(n < 1000000000 && n / 10000000 % 100000000 >= 1)
            return (n / 100000000).toFixed(1) + '억';
        else if(n < 1000000000000)
            return Math.floor(n / 100000000) + '억';
        else
            return "≥1조";
    }

};