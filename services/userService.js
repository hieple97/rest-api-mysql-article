const db = require("../config/db");
const helper = require("../helper");
const config = require("../config");
async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT id, name, released_year, githut_rank, pypl_rank, tiobe_rank 
    FROM programming_languages LIMIT ${offset},${config.listPerPage}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta,
    };
}

async function create(programmingLanguage) {
    const result = await db.query(
        `INSERT INTO programming_languages 
    (name, released_year, githut_rank, pypl_rank, tiobe_rank) 
    VALUES 
    ("${programmingLanguage.name}", ${programmingLanguage.released_year}, ${programmingLanguage.githut_rank}, ${programmingLanguage.pypl_rank}, ${programmingLanguage.tiobe_rank})`
    );

    let message = "Error in creating programming language";

    if (result.affectedRows) {
        message = "Programming language created successfully";
    }

    return { message };
}

async function updateStatusUser(email) {
    const conn = await db.connection();
    const result = await conn.execute(
        `UPDATE user_social 
    SET status = 0
    WHERE email=${email}`
    );

    let message = "Error in updating status user";

    if (result.affectedRows) {
        message = "Status user updated successfully";
    }

    return { message };
}

async function upsertUser(type, data) {
    const { last_name, first_name, email, facebook_id } = data;
    const conn = await db.connection();
    const result = await conn.execute(
        `INSERT INTO user_social (facebook_id,last_name,first_name,email) VALUES("${facebook_id}","${last_name}","${first_name}","${email}") ON DUPLICATE KEY UPDATE facebook_id = "${type.facebook_id}", email = "${type.email}" `
    );

    let message = "Error in upsert user";

    if (result.affectedRows) {
        message = "User upsert successfully";
    }

    return { message };
}

async function remove(id) {
    const result = await db.query(
        `DELETE FROM programming_languages WHERE id = ${id} `
    );

    let message = "Error in deleting programming language";

    if (result.affectedRows) {
        message = "Programming language deleted successfully";
    }

    return { message };
}

module.exports = {
    getMultiple,
    create,
    updateStatusUser,
    remove,
    upsertUser
};