import Axios from "axios";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  GetResult: async (eventId, sessionIndex,serverIp="127.0.0.1:8080") => {
    let host= `http://${serverIp}`
    const res = await Axios.get(`${host}/play/field/event_result_list.json`, {
      eventId,
      sessionIndex,
    });
    return res.data;
  },
  GetGameInfo: async (serverIp="127.0.0.1:8080") => {
    let host= `http://${serverIp}`
    const res = await Axios.get(`${host}/play/field/game_info.json`, {});
    return res.data;
  },
  GetEventSession: async (eventId,serverIp="127.0.0.1:8080") => {
    let host= `http://${serverIp}`
    const res = await Axios.get("/play/field/event_sessions.json", { params:{eventId:eventId} });
    return res.data;
  },
  GetEventInfo: async (eventId,serverIp="127.0.0.1:8080") => {
    let host= `http://${serverIp}`
    const res = await Axios.get("/play/field/event.json", { params:{eventId:eventId} });
    return res.data;
  },
  // GetAthleteList: async (eventId, sessionIndex,serverIp="127.0.0.1:8080") => {
  //   let host= `http://${serverIp}`
  //   const res = await Axios.get("/api4/result/getGymnasticsEventResultList", {
  //     params:{
  //       eventId,
  //       sessionIndex,
  //     }
  //   });
  //   return res.data;
  // },
  UpdateResult: async (objData,serverIp="127.0.0.1:8080") => {
    let host= `http://${serverIp}`
    const res = await Axios.post(`${host}/play/update_field_result.json`, objData);
    return res;
  },

  // GetEventList: async (serial,serverIp="127.0.0.1:8080") => {
  //   let host= `http://${serverIp}`
  //   const res = await Axios.get(`${host}/eventSession/getEvents`, {params:{ serial: serial }});
  //   return res.data;
  // },
  // GetChangList: async (serial,serverIp="127.0.0.1:8080") => {
  //   let host= `http://${serverIp}`
  //   const res = await Axios.get(`${host}/eventSession/getList`);
  //   return res.data;
  // },

// =============================================
  GetChangList: async (serial,serverIp="127.0.0.1:8080") => {
    let host= `http://${serverIp}`
    const res = await Axios.get(`${host}/api4/event/getEventList`);
    return res.data;
  },

  GetEventList: async (serial,serverIp="127.0.0.1:8080") => {
    let host= `http://${serverIp}`
    const res = await Axios.get(`${host}/api4/arrangement/eventRank`, {params:{ serial: serial }});
    return res.data;
  },

  GetAthleteList: async (eventId,serverIp="127.0.0.1:8080") => {
    let host= `http://${serverIp}`
    const res = await Axios.get(`${host}/api4/result/getGymnasticsEventResultList`, {
      params:{
        eventId,
      }
    });
    return res.data;
  },


  UpdateResult: async (objData,serverIp="127.0.0.1:8080") => {
    let host= `http://${serverIp}`
    const res = await Axios.post(`${host}/api4/result/updateEvent3`, objData);
    return res;
  },

};
