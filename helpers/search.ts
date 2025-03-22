interface SearchQuery {
    keyword?: string;
}

interface ObjectSearch {
    keyword: string;
    regex?: RegExp;
}

const search = (query: SearchQuery): ObjectSearch => {
    let objectSearch: ObjectSearch = {
        keyword: "",
    };
    
    if (query.keyword){
        objectSearch.keyword = query.keyword;
        const regex = new RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regex;
    }
    return objectSearch;
};

export default search; 