const getColorForRating = {
     name:  (ratingCode) => {
        switch (ratingCode) {
            case 'NC-17':
                return 't16';
            case 'R':
                return 'dat-truoc';
            case 'PG-13':
                return 't13';
            case 'PG-16':
                return 't16';
            case 'PG-18':
                return 't18';
            case 'PG':
                return 'p';
            case 'G':
                return 'k';
            case 'SS':
                return 'sneak-show';
            default:
                return '#f50';
        }
    }
}

export default getColorForRating