function initSCORM() {
  if (window.API) window.API.LMSInitialize("");
}

function completeSCORM(score) {
  if (window.API) {
    window.API.LMSSetValue("cmi.core.score.raw", score);
    window.API.LMSSetValue("cmi.core.lesson_status", "completed");
    window.API.LMSCommit("");
    window.API.LMSFinish("");
  }
}


