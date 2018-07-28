/**
 * Handler job api
 * @auhthor Then Thach
 */
'use strict'
const Job = use('App/Models/Job');
class JobController {
    /**
     * get list user
     * @returns {Promise<void>}
     */
    async getList(){
        return await Job.where({
            _id : { $exists : true }
        }).paginate(1, 10);
    }
}

module.exports = JobController
