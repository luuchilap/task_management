module.exports = (objectPagination, query,countProducts) => {
    if(query.page){
        objectPagination.currentPage = parseInt(query.page); 
    }

    if(query.limit){
        objectPagination.limitItems = parseInt(query.limit); 
    } 

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    const totalPage = Math.ceil(countProducts/objectPagination.limitItems);
    // console.log(totalPage);
    objectPagination.totalPage = totalPage;
    return objectPagination;
}