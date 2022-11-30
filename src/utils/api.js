import Axios from "axios";
import store from "store";


function getserverIp (){
  console.log("获取ip地址：",store.get('serverIp'))
  return store.get('serverIp');
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  GetResult: async (eventId, sessionIndex,serverIp=getserverIp()) => {
    let host= `http://${serverIp}`
    const res = await Axios.get(`${host}/play/field/event_result_list.json`, {
      eventId,
      sessionIndex,
    });
    return res.data;
  },
  GetGameInfo: async (serverIp=getserverIp()) => {
    let host= `http://${serverIp}`
    const res = await Axios.get(`${host}/play/field/game_info.json`, {});
    return res.data;
  },
  GetEventSession: async (eventId,serverIp=getserverIp()) => {
    let host= `http://${serverIp}`
    const res = await Axios.get("/play/field/event_sessions.json", { params:{eventId:eventId} });
    return res.data;
  },
  GetEventInfo: async (eventId,serverIp=getserverIp()) => {
    let host= `http://${serverIp}`
    const res = await Axios.get("/play/field/event.json", { params:{eventId:eventId} });
    return res.data;
  },
  // GetAthleteList: async (eventId, sessionIndex,serverIp=getserverIp()) => {
  //   let host= `http://${serverIp}`
  //   const res = await Axios.get("/api4/result/getGymnasticsEventResultList", {
  //     params:{
  //       eventId,
  //       sessionIndex,
  //     }
  //   });
  //   return res.data;
  // },
  UpdateResult: async (objData,serverIp=getserverIp()) => {
    let host= `http://${serverIp}`
    const res = await Axios.post(`${host}/play/update_field_result.json`, objData);
    return res;
  },

  // GetEventList: async (serial,serverIp=getserverIp()) => {
  //   let host= `http://${serverIp}`
  //   const res = await Axios.get(`${host}/eventSession/getEvents`, {params:{ serial: serial }});
  //   return res.data;
  // },
  // GetChangList: async (serial,serverIp=getserverIp()) => {
  //   let host= `http://${serverIp}`
  //   const res = await Axios.get(`${host}/eventSession/getList`);
  //   return res.data;
  // },

// =============================================
  GetChangList: async (serial,serverIp=getserverIp()) => {
    let host= `http://${serverIp}`
    const res = await Axios.get(`${host}/api4/event/getEventList`);
    return res.data;
  },

  GetEventList: async (serial,serverIp=getserverIp()) => {
    let host= `http://${serverIp}`
    const res = await Axios.get(`${host}/api4/arrangement/eventRank`, {params:{ serial: serial }});
    return res.data;
  },

  GetAthleteList: async (eventId,serverIp=getserverIp()) => {
    let host= `http://${serverIp}`
    const res = await Axios.get(`${host}/api4/result/getGymnasticsEventResultList`, {
      params:{
        eventId,
      }
    });
    return res.data;
  },


  UpdateResult: async (objData,serverIp=getserverIp()) => {
    let host= `http://${serverIp}`
    const res = await Axios.post(`${host}/api4/result/updateEvent3`, objData);
    return res;
  },

};
