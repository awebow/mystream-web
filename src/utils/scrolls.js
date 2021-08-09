export default {

    nearBottom(fetchPromise) {
        let fetching = false;
        let listener = function() {
            if(!fetching && 
                window.scrollY + window.innerHeight >= document.body.clientHeight - window.innerHeight) {

                fetching = true;
                fetchPromise().finally(function() {
                    fetching = false;
                });
            }
        };

        return {
            enable: () => window.addEventListener('scroll', listener),
            disable: () => window.removeEventListener('scroll', listener)
        }
    }

}