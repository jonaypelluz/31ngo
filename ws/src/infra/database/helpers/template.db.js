const { connect } = require('@/services/db.service');

export const up = async () => {
  const db = await connect();
  /*
      Code your update script here!
   */
};

export const down = async () => {
  const db = await connect();
  /*
      Code you downgrade script here!
   */
};
