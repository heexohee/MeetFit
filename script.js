const {
  directoryPeople,
  defaultAttendeeRoles,
  defaultTimeCriteria,
  weeklyCandidateDays,
  candidateRows,
  meetingDetails,
  replyDeadline,
  responseOptions,
  defaultResponseSelections,
  defaultResponseContextChecks,
  recommendations,
  recommendationVotes,
} = window.MeetFitMockData;

let attendeeRoles = defaultAttendeeRoles.map((role) => ({ ...role }));

let attendeeSearchTerm = "";

let timeCriteria = { ...defaultTimeCriteria };

let participantAttendeesOpen = false;

const screens = [
  {
    number: "1",
    title: "회의 만들기",
    sub: "기본 정보를 입력하고 구글 캘린더에서 불가능한 시간을 먼저 제외합니다.",
    stepperIndex: 0,
    menuIndex: 0,
    html: () => `
      <div class="panel-width-sm">
        <div class="content-title">
          <h2>새 회의 만들기</h2>
          <p>회의에 필요한 사람들과 각자의 상황을 함께 고려해 최적의 회의 시간을 추천해드려요.</p>
        </div>

        <div class="field-stack">
          <div class="field">
            <label for="meetingName">회의 이름</label>
            <input class="input" id="meetingName" value="상품 운영 회고" />
          </div>

          <div class="field">
            <span class="field-label">언제까지 만나야 하나요?</span>
            <div class="range-preset-group" role="group" aria-label="회의 가능 기간">
              <button class="range-preset" type="button">
                <strong>이번 주 근무일</strong>
                <span>2026. 7. 10 (금)</span>
              </button>
              <button class="range-preset is-selected" type="button" aria-pressed="true">
                <strong>다음 주 근무일</strong>
                <span>2026. 7. 13 (월) - 7. 17 (금)</span>
              </button>
              <button class="range-preset" type="button">
                <strong>기타</strong>
                <span>직접 날짜 입력</span>
              </button>
            </div>
            <div class="selected-range-note">
              <span>선택된 기간</span>
              <strong>2026. 7. 13 (월) - 7. 17 (금)</strong>
            </div>
          </div>

          <div class="field">
            <label for="duration">회의는 얼마나 걸리나요?</label>
            <select class="select" id="duration">
              <option>1시간</option>
              <option>30분</option>
              <option>1시간 30분</option>
            </select>
          </div>

          <div class="field">
            <span class="field-label">후보 시간 기준을 확인해주세요 <em class="optional-label">(선택)</em></span>
            <p class="field-help">기본값 그대로 진행해도 되고, 업무 시간이 다르면 수정할 수 있어요.</p>
            <div class="time-criteria-card" aria-label="후보 시간 기준">
              <div class="time-criteria-row">
                <div class="time-criteria-label">
                  <span>업무 시간</span>
                  <small>이 시간 안에서 후보를 찾아요</small>
                </div>
                <div class="time-input-pair">
                  <input class="time-input" type="time" data-time-criteria="workStart" value="${timeCriteria.workStart}" aria-label="업무 시작 시간" />
                  <span>~</span>
                  <input class="time-input" type="time" data-time-criteria="workEnd" value="${timeCriteria.workEnd}" aria-label="업무 종료 시간" />
                </div>
              </div>
              <div class="time-criteria-row">
                <div class="time-criteria-label">
                  <span>점심시간</span>
                  <small>후보를 찾을 때 비워둘 시간이에요</small>
                </div>
                <div class="time-input-pair">
                  <input class="time-input" type="time" data-time-criteria="lunchStart" value="${timeCriteria.lunchStart}" aria-label="점심 시작 시간" />
                  <span>~</span>
                  <input class="time-input" type="time" data-time-criteria="lunchEnd" value="${timeCriteria.lunchEnd}" aria-label="점심 종료 시간" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="hint-box action-hint">
          <span class="info-icon" aria-hidden="true">i</span>
          <span>다음 단계에서 참석자를 추가하면, 이 기준과 각자의 캘린더 일정을 함께 확인해 후보 시간을 찾습니다.</span>
        </div>

        <button class="primary-btn" type="button" data-next="1">다음: 참석자 설정</button>

      </div>
    `,
  },
  {
    number: "2",
    title: "참석자 설정",
    sub: "주최자가 참석자를 검색해 목록에 넣고, 논의 필요도를 구분합니다.",
    stepperIndex: 1,
    menuIndex: 1,
    html: () => {
      const selected = people();
      const query = attendeeSearchTerm.trim().toLowerCase();
      const searchResults = searchDirectoryPeople(query);

      return `
        <div class="panel-width-lg">
          <div class="attendee-layout">
            <section>
              <div class="content-title compact-title search-title">
                <h2>참석자 추가하기</h2>
                <p>회사 구성원을 이름, 직함, 팀으로 검색해서 회의 참석자 목록에 넣습니다.</p>
                <span class="section-count">${selected.length}/25</span>
              </div>
              <div class="attendee-search-area">
                <label class="search-box">
                  <span class="sr-only">참석자 검색</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.3-4.3"></path><circle cx="11" cy="11" r="7"></circle></svg>
                  <input id="attendeeSearch" value="${escapeHtml(attendeeSearchTerm)}" placeholder="이름 또는 이메일로 검색" autocomplete="off" />
                </label>
                <div class="directory-list search-results" data-search-results ${query ? "" : "hidden"}>
                  ${directorySearchResultsHtml(searchResults)}
                </div>
              </div>
            </section>

            <section>
              <div class="content-title compact-title">
                <h2>추가한 참석자</h2>
                <p>회의에서 꼭 필요한 사람은 필수로, 함께 하면 좋은 사람은 선택으로 표시합니다.</p>
                <span class="section-count">${selected.length}명</span>
              </div>
              <div class="attendee-list">
                ${
                  selected.length
                    ? selected.map((person) => attendeeRow(person, person.required)).join("")
                    : `<div class="empty-row">아직 추가한 참석자가 없어요.</div>`
                }
              </div>
            </section>
          </div>

          <div class="hint-box action-hint">
            <span class="info-icon" aria-hidden="true">i</span>
            <span>다음 단계에서 참석자의 캘린더를 확인해서 회의 가능한 후보 시간대를 찾습니다.</span>
          </div>

          <div class="button-row attendee-actions">
            <button class="secondary-btn" type="button" data-next="0">이전</button>
            <button class="primary-btn" type="button" data-next="2">다음: 후보 시간 찾기</button>
          </div>
        </div>
      `;
    },
  },
  {
    number: "3",
    title: "후보 시간 찾기",
    sub: "구글 캘린더에서 겹치지 않는 시간을 후보로 만들고, 아직 캘린더에 없는 맥락은 따로 남겨둡니다.",
    stepperIndex: 2,
    menuIndex: 0,
    html: () => {
      const participantCount = people().length;
      const syncLabels = [
        `${participantCount}명 구글 캘린더 일정 확인 중`,
        `${participantCount}명 일정에서 겹치는 시간 제외 중`,
        `${participantCount}명 구글 캘린더 일정 확인 완료`,
      ];
      const isComplete = calendarSyncPhase >= 2;

      return `
      <div class="panel-width-md">
        <div class="content-title ${isComplete ? "with-action" : ""}">
          <div>
            <h2>${isComplete ? "TOP 3 후보 시간대" : "캘린더에서 가능한 시간을 찾고 있어요"}</h2>
            <p>${
              isComplete
                ? "캘린더와 참석 조건을 바탕으로 가장 적합한 시간대를 추렸어요."
                : `${participantCount}명의 구글 캘린더에서 이미 불가능한 시간을 먼저 제외합니다.`
            }</p>
          </div>
          ${isComplete ? `<button class="ghost-btn tiny-btn" type="button" data-refresh-calendar>다시 찾아보기</button>` : ""}
        </div>

        ${
          isComplete
            ? ""
            : `
              <div class="calendar-sync" aria-label="구글 캘린더 조회 상태" aria-live="polite">
                <div class="sync-head">
                  <div class="sync-title">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"></path>
                    </svg>
                    ${syncLabels[calendarSyncPhase]}
                  </div>
                  <span class="sync-status">${calendarSyncPhase + 1}/3 진행 중</span>
                </div>
                <div class="sync-steps">
                  <div class="sync-step ${syncStepState(0)}">
                    <strong>캘린더 연결</strong>
                    <span>${calendarSyncPhase > 0 ? "업무 시간과 휴가 일정을 불러왔어요" : `${participantCount}명의 캘린더를 연결하고 있어요`}</span>
                  </div>
                  <div class="sync-step ${syncStepState(1)}">
                    <strong>겹치는 일정 제외</strong>
                    <span>${calendarSyncPhase > 1 ? "이미 바쁜 시간은 후보에서 제외했어요" : "이미 막힌 일정을 확인하고 있어요"}</span>
                  </div>
                  <div class="sync-step ${syncStepState(2)}">
                    <strong>후보 생성</strong>
                    <span>남은 시간에서 후보를 준비하고 있어요</span>
                  </div>
                </div>
              </div>
            `
        }

        ${
          isComplete
            ? `
              ${weeklyCandidateView()}

              <div class="hint-box action-hint">
                <span class="info-icon" aria-hidden="true">i</span>
                <span>다음 단계에서 시간 조율 이메일을 보내기 전, 참석자와 후보 시간대를 최종 확인합니다.</span>
              </div>

              <div class="button-row">
                <button class="secondary-btn" type="button" data-next="1">이전</button>
                <button class="primary-btn" type="button" data-next="3">다음: 조율 요청 확인</button>
              </div>
            `
            : `
              <div class="candidate-loading" aria-live="polite">
                <span class="loading-spinner" aria-hidden="true"></span>
                <div>
                  <strong>캘린더에서 가능한 시간을 찾고 있어요</strong>
                  <span>확인이 끝나면 다음 주 후보 시간이 표시됩니다.</span>
                </div>
              </div>
            `
        }
      </div>
    `;
    },
  },
  {
    number: "4",
    title: "조율 요청 보내기",
    sub: "참석자에게 사내 Google 이메일로 후보 시간 응답 요청을 보냅니다.",
    stepperIndex: 3,
    menuIndex: 0,
    html: () => {
      const targetRecipients = recipients();
      const selectedCandidates = selectedCandidateRows();

      return `
        <div class="panel-width-md">
          <div class="content-title">
            <h2>참석자에게 이메일로 요청할게요</h2>
            <p>발송 대상과 후보 시간, 회신 마감시간을 확인한 뒤 사내 Google 이메일로 조율 요청을 보냅니다.</p>
          </div>

          <section class="email-confirm-section">
            <div class="panel-title-line">
              <p class="field-label">발송 대상 (${targetRecipients.length}명)</p>
              ${emailRequestSent ? "" : `<button class="ghost-btn" type="button" data-next="1">편집</button>`}
            </div>

            <div class="people-list email-recipient-list">
              ${
                targetRecipients.length
                  ? targetRecipients.map((person) => emailRecipientRow(person)).join("")
                  : `<div class="empty-row">조율 요청을 받을 참석자를 추가해주세요.</div>`
              }
            </div>
          </section>

          <section class="email-confirm-section">
            <div class="panel-title-line">
              <p class="field-label">보낼 후보 시간 (${selectedCandidates.length}개)</p>
              ${emailRequestSent ? "" : `<button class="ghost-btn" type="button" data-next="2">후보 다시 보기</button>`}
            </div>

            <div class="email-candidate-list">
              ${selectedCandidates.map((candidate) => emailCandidateRow(candidate)).join("")}
            </div>
          </section>

          <section class="email-confirm-section">
            <p class="field-label">회신 마감시간</p>
            <div class="deadline-card">
              <strong>${replyDeadline}까지 응답을 받습니다.</strong>
              <span>마감 시간이 지나면 도착한 응답을 바탕으로 회의 시간을 확정하고, 참석자에게 최종 확인 메일을 보낼 수 있어요.</span>
            </div>
          </section>

          <div class="hint-box action-hint">
            <span class="info-icon" aria-hidden="true">i</span>
            <span>각 참석자에게는 본인 일정과 겹치지 않는 후보 시간, 회의 길이, 앞뒤 일정, 참석자 정보, 회신 마감시간이 전달됩니다.</span>
          </div>

          <div class="button-row">
            ${emailRequestSent ? "" : `<button class="secondary-btn" type="button" data-next="2">이전</button>`}
            ${
              emailRequestSent
                ? `<button class="primary-btn" type="button" data-next="4">다음: 응답 현황 확인</button>`
                : targetRecipients.length
                ? `<button class="primary-btn" type="button" data-send-request>조율 요청 이메일 보내기</button>`
                : `<button class="primary-btn" type="button" data-next="1">참석자 추가하기</button>`
            }
          </div>
        </div>
      `;
    },
  },
  {
    number: "5",
    title: "응답 대기",
    sub: "주최자는 참석자 응답이 모일 때까지 진행 상태를 확인합니다.",
    stepperIndex: 3,
    menuIndex: 0,
    html: () => {
      const targetRecipients = recipients();
      const completedCount = completedRecipientCount();
      const requiredComplete = requiredResponseComplete();
      const recommendationReady = targetRecipients.length > 0 && completedCount === targetRecipients.length;
      const responseProgress = targetRecipients.length ? Math.round((completedCount / targetRecipients.length) * 100) : 0;

      return `
        <div class="panel-width-md">
          <div class="content-title">
            <h2>${recommendationReady ? "응답이 모두 도착했어요" : "응답을 기다리고 있어요"}</h2>
            <p>${
              recommendationReady
                ? "응답 결과를 확인하고 최종 초대할 시간을 선택할 수 있어요."
                : "필수 참석자가 모두 응답하면 주최자에게 알려드려요. 마감 시간이 지나면 도착한 응답을 바탕으로 회의 시간을 확정할 수 있어요."
            }</p>
          </div>

          ${
            recommendationReady
              ? `<div class="calendar-note is-success">
                  <span class="success-icon" aria-hidden="true">✓</span>
                  <span>참석자 전원이 응답했어요. 다음 화면에서 후보별 응답 결과를 확인할 수 있어요.</span>
                </div>
                ${responseDetailsToggleHtml(targetRecipients, completedCount)}`
              : requiredComplete
              ? `<div class="calendar-note">
                  <span class="info-icon" aria-hidden="true">i</span>
                  <span>필수 참석자가 모두 응답했어요. 주최자에게 조율을 이어가라는 알림 메일이 발송됩니다.</span>
                </div>`
              : ""
          }

          ${
            recommendationReady
              ? ""
              : `<section class="email-confirm-section">
                  <div class="response-status-head">
                    <div>
                      <p class="field-label">응답 상태</p>
                      <strong>${completedCount}/${targetRecipients.length}명 응답</strong>
                    </div>
                    <div class="response-status-meta">
                      <span>발송 완료</span>
                      <span>마감 ${replyDeadline}</span>
                    </div>
                  </div>
                  <div class="response-progress" aria-label="응답 진행률 ${responseProgress}%">
                    <span style="width: ${responseProgress}%"></span>
                  </div>
                  <div class="response-status-copy">
                    ${completedCount ? "도착한 응답을 실시간으로 반영하고 있어요." : "아직 응답을 기다리고 있어요."}
                    마감 전까지 이 화면에서 진행 상태를 다시 확인할 수 있어요.
                  </div>

                  <div class="people-list email-recipient-list">
                    ${
                      targetRecipients.length
                        ? targetRecipients.map((person) => waitingRecipientRow(person)).join("")
                        : `<div class="empty-row">응답을 기다릴 참석자가 없어요.</div>`
                    }
                  </div>
                </section>`
          }

          ${
            recommendationReady
              ? `<div class="button-row wait-action-row">
                  <button class="primary-btn" type="button" data-next="6">다음: 추천 시간 확인</button>
                </div>`
              : `<div class="button-row wait-action-row">
                  <button class="primary-btn" type="button" data-show-results>다음: 추천 시간 확인</button>
                </div>`
          }
        </div>
      `;
    },
  },
  {
    number: "6",
    title: "참석자 응답",
    sub: "참석자는 캘린더상 가능한 후보에 대해 가능/부담/어려움을 고릅니다.",
    stepperIndex: 3,
    menuIndex: 0,
    html: () => {
      const responsePerson = responsePreviewPerson();
      const organizer = directoryPeople.find((person) => person.id === "minji") || people()[0];
      const visibleCandidates = participantCandidateRows(responsePerson);
      const excludedCount = selectedCandidateRows().length - visibleCandidates.length;

      return `
        <div class="response-layout">
        <div class="response-title">
          <h2>${responsePerson.name}님, 일정 조율을 부탁드려요</h2>
          <p>${organizer.name}님이 보낸 일정 조율 요청이에요.<br />후보별 앞뒤 일정을 확인하고, 가능한 정도를 선택해주세요.</p>
        </div>

        <div class="response-brief" aria-label="회의 정보">
          <div>
            <span>회의 정보</span>
            <strong>${meetingDetails.name}</strong>
          </div>
          <dl>
            <div>
              <dt>길이</dt>
              <dd>${meetingDetails.duration}</dd>
            </div>
            <div>
              <dt>기간</dt>
              <dd>${meetingDetails.range}</dd>
            </div>
          </dl>
        </div>

        <div class="participant-attendees">
          <button class="participant-attendees-toggle" type="button" data-toggle-participant-attendees aria-expanded="${participantAttendeesOpen}">
            <span>${participantAttendeesOpen ? "▴" : "▾"} 참석자 정보</span>
            <small>${people().length}명</small>
          </button>
          ${
            participantAttendeesOpen
              ? `<div class="participant-attendee-list">
                  ${people()
                    .map(
                      (person) => `
                        <div class="participant-attendee-row">
                          <span class="avatar" aria-hidden="true">${person.initial}</span>
                          <div>
                            <strong>${person.name}</strong>
                            <span>${person.title} · ${person.team}</span>
                          </div>
                        </div>
                      `,
                    )
                    .join("")}
                </div>`
              : ""
          }
        </div>

        <div class="response-deadline-card">
          <span class="warning-dot" aria-hidden="true">!</span>
          <div>
            <strong>회신 마감 ${replyDeadline}</strong>
            <span>마감 전까지 가능한 정도를 선택해주세요.</span>
          </div>
        </div>

        <div class="response-divider" aria-hidden="true"></div>

        <div class="response-section-head">
          <div>
            <h3>후보 시간 선택</h3>
            <p>각 시간의 앞뒤 일정을 보고 실제 가능한 정도를 골라주세요.</p>
          </div>
          <span>${visibleCandidates.length}개 후보</span>
        </div>

        ${
          excludedCount > 0
            ? `<div class="response-filter-note">이미 일정이 있는 후보 ${excludedCount}개는 제외했어요.</div>`
            : ""
        }

        <div class="response-candidate-list">
          ${visibleCandidates.map((candidate) => responseCandidateCard(candidate)).join("")}
        </div>

        <div class="condition-box">
          <h3>이런 상황도 함께 알려주세요 <span class="muted">(선택)</span></h3>
          <div class="check-list">
            ${responseContextCheck("lunch", "점심 직후 시간은 조금 부담돼요")}
            ${responseContextCheck("travel", "외근이나 이동이 많은 요일이 있어요")}
            ${responseContextCheck("morning", "오전이 더 좋아요")}
            ${responseContextCheck("afternoon", "오후가 더 좋아요")}
            ${responseContextCheck("other", "기타 사정이 있어요")}
          </div>
        </div>

        <button class="primary-btn" type="button" data-submit-response>내 의견 보내기</button>
      </div>
      `;
    },
  },
  {
    number: "7",
    title: "추천 시간 확인",
    sub: "주최자는 응답과 캘린더 조건을 합쳐 추천 후보 TOP 3를 확인합니다.",
    stepperIndex: 4,
    menuIndex: 0,
    html: () => `
      <div class="panel-width-md">
        <div class="content-title">
          <h2>최적의 회의 시간을 찾았어요</h2>
          <p>모두의 응답과 캘린더 조건을 함께 반영했어요.</p>
        </div>

        <div class="pill blue">${recipients().length}명 중 ${completedRecipientCount()}명이 응답했어요 · ${requiredResponseComplete() ? "필수 참석자 응답 완료" : `마감 ${replyDeadline} 이후 자동 추천`}</div>

        <p class="field-label top-gap">추천 시간 TOP 3</p>
        ${recommendationCardsHtml()}

        <div class="hint-box action-hint">
          <span class="info-icon" aria-hidden="true">i</span>
          <span>위 응답 결과를 바탕으로 선택한 시간의 Google Calendar 초대를 만들고, 참석자에게 최종 확인 메일을 보냅니다.</span>
        </div>

        <div class="button-row final-invite-action">
          ${
            finalRecommendationId
              ? `<button class="primary-btn" type="button" data-finalize-recommendation="${finalRecommendationId}">선택한 시간으로 일정 확정하기</button>`
              : `<button class="primary-btn" type="button" disabled>최종 시간을 선택해주세요</button>`
          }
        </div>
      </div>
    `,
  },
  {
    number: "8",
    title: "추천 시간 상세",
    sub: "추천된 이유와 남은 부담을 설명해 확정 전 판단을 돕습니다.",
    stepperIndex: 4,
    menuIndex: 0,
    html: () => `
      <div class="panel-width-lg">
        <div class="content-title">
          <h2>이 시간을 추천한 이유</h2>
          <p>각자의 응답을 같은 기준으로 비교했어요. 회의가 성립하는 조건을 먼저 확인하고, 그다음 가능한 한 많은 사람의 부담을 줄이는 시간을 골랐어요.</p>
        </div>

        <h3 class="detail-date">${recommendedFinalTime().date} ${recommendedFinalTime().time}</h3>

        <div class="detail-metrics">
          <div class="metric-card"><strong>${selectedPeople(true).length} / ${selectedPeople(true).length}명 가능</strong><span>필수 참석자</span></div>
          <div class="metric-card"><strong>${selectedPeople(false).length} / ${selectedPeople(false).length}명 가능</strong><span>선택 참석자</span></div>
          <div class="metric-card"><strong>없음</strong><span>부담 조건</span></div>
          <div class="metric-card"><strong>3명</strong><span>오전 선호 반영</span></div>
        </div>

        <section class="response-summary">
          <h3>참석자별 응답 요약</h3>
          ${people()
            .map(
              (person) => `
                <div class="summary-row">
                  <span class="avatar">${person.initial}</span>
                  <strong>${person.name}</strong>
                  <span class="role-pill ${person.required ? "required" : "optional"}">${person.required ? "필수 참석자" : "선택 참석자"}</span>
                  <span>${person.summary}</span>
                </div>
              `,
            )
            .join("")}
        </section>

        <div class="button-row">
          <button class="secondary-btn" type="button" data-next="6">이전</button>
          ${
            finalRecommendationId
              ? `<button class="primary-btn" type="button" data-finalize-recommendation="${finalRecommendationId}">선택한 시간으로 일정 확정하기</button>`
              : `<button class="primary-btn" type="button" disabled>최종 시간을 선택해주세요</button>`
          }
        </div>
      </div>
    `,
  },
  {
    number: "9",
    title: "일정 공유 완료",
    sub: "주최자는 확정된 일정을 참석자 캘린더에 공유합니다.",
    stepperIndex: 5,
    menuIndex: 2,
    html: () => `
      <div class="center-complete">
        <div class="complete-inner">
          ${celebrateIcon()}
          <h2>회의 시간이 공유됐어요!</h2>
          <p>모두의 응답을 바탕으로<br /><strong>${finalRecommendation().date} ${finalRecommendation().time}</strong>에 만나기로 했어요.</p>
          <p class="complete-subcopy">구글 캘린더 초대와 최종 확인 메일을 참석자에게 보냈어요.</p>

          <div class="share-list">
            ${people()
              .map(
                (person) => `
                  <div class="share-row final-share-row">
                    <span class="avatar">${person.initial}</span>
                    <strong>${person.name}</strong>
                    <span class="role-pill ${person.required ? "required" : "optional"}">${person.required ? "필수 참석자" : "선택 참석자"}</span>
                  </div>
                `,
              )
              .join("")}
          </div>
          <a class="primary-btn host-calendar-link" href="https://calendar.google.com/calendar/u/0/r" target="_blank" rel="noreferrer">구글 캘린더에서 보기</a>
        </div>
      </div>
    `,
  },
  {
    number: "10",
    title: "일정 통보",
    sub: "참석자는 확정 시간과 변경 요청 경로를 함께 확인합니다.",
    stepperIndex: 5,
    menuIndex: 2,
    html: () => `
      <div class="center-complete">
        <div class="complete-inner">
          ${celebrateIcon()}
          <h2>회의 시간이 정해졌어요!</h2>
          <p>보내주신 응답을 바탕으로<br />최적의 회의 시간으로 정해졌어요.</p>

          <div class="final-time">
            <strong>${finalRecommendation().date} ${finalRecommendation().time}</strong>
            <span>상품 운영 회고 (1시간)</span>
          </div>

          <div class="notice-box">
            <span class="info-icon" aria-hidden="true">i</span>
            <span>참석이 어려워졌다면 변경 요청을 보낼 수 있어요. 모두에게 공유되기 전에 주최자가 다시 조율할게요.</span>
          </div>

          <button class="secondary-btn" type="button">캘린더에서 보기</button>
          <button class="ghost-btn" type="button">시간이 어려워졌어요</button>
        </div>
      </div>
    `,
  },
];

let responseSelections = { ...defaultResponseSelections };

let responseContextChecks = { ...defaultResponseContextChecks };

const panel = document.querySelector("#screenPanel");
const numberNode = document.querySelector("#screenNumber");
const headingNode = document.querySelector("#screenHeading");
const subheadingNode = document.querySelector("#screenSubheading");
const stepButtons = [...document.querySelectorAll(".step")];
const menuButtons = [...document.querySelectorAll("[data-menu-step]")];
const isParticipantPage = document.body.dataset.view === "participant";

let currentStep = 0;
let calendarSyncPhase = 0;
let calendarSyncCompleted = false;
let calendarSyncRunId = 0;
let calendarSyncTimers = [];
let isPointerInsideAttendeeSearch = false;
let emailRequestSent = false;
let attendeeResponseSubmitted = false;
let expandedRecommendationId = "";
let finalRecommendationId = "final-jul14-1000";
let maxUnlockedStep = 0;

function people() {
  return attendeeRoles
    .map((role) => {
      const person = directoryPeople.find((item) => item.id === role.id);
      return person ? { ...person, required: role.required } : undefined;
    })
    .filter(Boolean);
}

function selectedPeople(required) {
  return people().filter((person) => person.required === required);
}

function recipients() {
  return people().filter((person) => person.id !== "minji");
}

function requiredRecipients() {
  return recipients().filter((person) => person.required);
}

function completedRecipientCount() {
  return attendeeResponseSubmitted ? recipients().length : 0;
}

function requiredResponseComplete() {
  const required = requiredRecipients();
  return required.length > 0 && attendeeResponseSubmitted;
}

function attendeeRow(person, required) {
  const isHost = person.id === "minji";
  return `
    <div class="attendee-row ${isHost ? "is-host" : ""}">
      <span class="avatar">${person.initial}</span>
      <div class="person-main">
        <strong>${person.name}${isHost ? ` (나) <span class="host-badge">주최자</span>` : ""}</strong>
        <span>${person.title} · ${person.team}</span>
      </div>
      <div class="role-control" aria-label="${person.name} 참석 구분">
        <button class="${required ? "is-selected" : ""}" type="button" data-role="required" data-person="${person.id}">필수</button>
        <button class="${!required ? "is-selected" : ""}" type="button" data-role="optional" data-person="${person.id}">선택</button>
      </div>
      ${
        isHost
          ? `<span class="row-spacer" aria-hidden="true"></span>`
          : `<button class="icon-button" type="button" data-remove="${person.id}" aria-label="${person.name} 참석자에서 제외">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>
            </button>`
      }
    </div>
  `;
}

function directoryRow(person) {
  const selectedRole = attendeeRoles.find((role) => role.id === person.id);
  const selected = Boolean(selectedRole);
  const isHost = person.id === "minji";
  return `
    <div class="directory-row ${selected ? "is-added" : ""}">
      <span class="avatar">${person.initial}</span>
      <div class="person-main">
        <strong>${person.name}${isHost ? " (나)" : ""}</strong>
        <span>${person.title} · ${person.team}</span>
      </div>
      <div class="role-control" aria-label="${person.name} 참석 구분">
        <button
          class="${selectedRole?.required ? "is-selected" : ""}"
          type="button"
          ${isHost ? "disabled" : `data-search-role="required" data-search-person="${person.id}"`}
        >필수</button>
        <button
          class="${selectedRole && !selectedRole.required ? "is-selected" : ""}"
          type="button"
          ${isHost ? "disabled" : `data-search-role="optional" data-search-person="${person.id}"`}
        >선택</button>
      </div>
      <div class="directory-actions">
        ${
          selected
            ? isHost
              ? `<span class="row-spacer" aria-hidden="true"></span>`
              : `<button class="icon-button" type="button" data-search-remove="${person.id}" aria-label="${person.name} 목록에서 제거">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>
                </button>`
            : `<span class="row-spacer" aria-hidden="true"></span>`
        }
      </div>
    </div>
  `;
}

function searchDirectoryPeople(query) {
  if (!query) return [];

  return directoryPeople
    .filter((person) => {
      return [person.name, person.title, person.team, person.email]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .slice(0, 5);
}

function directorySearchResultsHtml(searchResults) {
  return searchResults.length
    ? searchResults.map((person) => directoryRow(person)).join("")
    : `<div class="empty-row">검색 결과가 없어요.</div>`;
}

function emailRecipientRow(person) {
  return `
    <div class="email-recipient-row ${emailRequestSent ? "is-sent" : ""}">
      <span class="avatar">${person.initial}</span>
      <div class="person-main">
        <strong>${person.name}</strong>
        <span>${person.email}</span>
      </div>
      <span class="role-pill ${person.required ? "required" : "optional"}">${person.required ? "필수 참석자" : "선택 참석자"}</span>
      ${emailRequestSent ? `<span class="send-status is-sent">발송 완료</span>` : ""}
    </div>
  `;
}

function waitingRecipientRow(person) {
  const isDone = attendeeResponseSubmitted;
  return `
    <div class="email-recipient-row ${isDone ? "is-sent" : ""}">
      <span class="avatar">${person.initial}</span>
      <div class="person-main">
        <strong>${person.name}</strong>
        <span>${person.email}</span>
      </div>
      <span class="role-pill ${person.required ? "required" : "optional"}">${person.required ? "필수 참석자" : "선택 참석자"}</span>
      <span class="send-status ${isDone ? "is-sent" : ""}">
        ${isDone ? "응답 완료" : "대기 중"}
      </span>
    </div>
  `;
}

function responseDetailRecipientRow(person) {
  return `
    <div class="email-recipient-row is-sent response-detail-recipient">
      <span class="avatar">${person.initial}</span>
      <div class="person-main">
        <strong>${person.name}</strong>
        <span>${person.email}</span>
        <em>${person.summary}</em>
      </div>
      <span class="role-pill ${person.required ? "required" : "optional"}">${person.required ? "필수 참석자" : "선택 참석자"}</span>
      <span class="send-status is-sent">응답 완료</span>
    </div>
  `;
}

function emailCandidateRow(candidate) {
  return `
    <div class="email-candidate-row">
      <div class="email-candidate-main">
        <div class="email-candidate-headline">
          <strong>${candidate.day} &nbsp; ${candidate.time}</strong>
          ${candidateScoreChip(candidate)}
        </div>
        <span>${candidate.beforeBuffer} · ${candidate.afterBuffer}</span>
      </div>
    </div>
  `;
}

function candidateTimeSlots() {
  return [...new Set(candidateRows.map((row) => row.start))];
}

function findCandidate(dateKey, start) {
  return candidateRows.find((row) => row.dateKey === dateKey && row.start === start);
}

function availabilitySummary(availability) {
  const optionalIssueCount = Math.max(availability.optionalTotal - availability.optionalAvailable, 0);
  return {
    required: availability.requiredAvailable === availability.requiredTotal
      ? "필수 참석자 전원 가능"
      : `필수 참석자 ${availability.requiredAvailable}/${availability.requiredTotal} 가능`,
    optional: optionalIssueCount
      ? "선택 참석자 일부 어려움"
      : "선택 참석자 전원 가능",
    optionalIssueCount,
  };
}

function availabilityChips(availability) {
  const summary = availabilitySummary(availability);
  return `
    <span class="availability-chip required">${summary.required}</span>
  `;
}

function candidateSummaryChip(candidate) {
  const summary = availabilitySummary(candidate.availability);
  const hasRequiredIssue = candidate.availability.issues.some((issue) => issue.role === "required");
  let text = "모두 참석 가능";

  if (hasRequiredIssue) {
    text = "필수 참석자 모두 가능 · 전후 일정 확인 필요";
  } else if (summary.optionalIssueCount > 0) {
    text = `필수 참석자 모두 가능 · 선택 참석자 ${summary.optionalIssueCount}명 어려움`;
  }

  return `<span class="candidate-summary-chip">${text}</span>`;
}

function candidateIssueRow(issue) {
  const isRequired = issue.role === "required";
  const label = isRequired ? "필수 참석자 전후 부담" : "선택 참석자 일부 어려움";
  const tone = isRequired ? "required" : "optional";
  return `
    <li class="candidate-issue ${tone}">
      <span>${label}</span>
      <em>${issue.name}님은 ${issue.text}</em>
    </li>
  `;
}

function weeklyCandidateCard(row) {
  const issues = row.availability.issues.slice(0, 2);
  return `
    <div class="weekly-candidate ${row.priority === "review" ? "is-review" : "is-recommended"}">
      <strong>${row.start} - ${row.end}</strong>
      <div class="candidate-availability">
        ${candidateSummaryChip(row)}
      </div>
      <span class="candidate-buffer">${row.beforeBuffer} · ${row.afterBuffer}</span>
      <ul class="candidate-issues">
        ${issues.map((issue) => candidateIssueRow(issue)).join("")}
      </ul>
    </div>
  `;
}

function rankedCandidateRows() {
  return [...candidateRows].sort((a, b) => b.score - a.score);
}

function selectedCandidateRows() {
  return rankedCandidateRows();
}

function responsePreviewPerson() {
  return recipients().find((person) => person.id === "junho") || recipients()[0] || people()[0];
}

function candidateConflictsWithPerson(candidate, person) {
  return candidate.availability.issues.some((issue) => {
    return issue.type === "busy" && issue.name === person.name;
  });
}

function participantCandidateRows(person = responsePreviewPerson()) {
  return selectedCandidateRows().filter((candidate) => !candidateConflictsWithPerson(candidate, person));
}

function candidateScoreTone(score) {
  if (score >= 90) return "high";
  if (score >= 80) return "mid";
  return "low";
}

function candidatePriorityLabel(candidate) {
  return candidate.priority === "recommended" ? "추천" : "검토";
}

function candidateScoreChip(candidate) {
  return `<span class="score-chip ${candidateScoreTone(candidate.score)}">적합도 ${candidate.score}점</span>`;
}

function weeklySummaryBlock(candidate) {
  return `
    <div class="weekly-summary-block ${candidate.priority === "review" ? "is-review" : "is-recommended"}">
      <strong>${candidate.start} - ${candidate.end}</strong>
      <span>${candidate.score}점 · ${candidatePriorityLabel(candidate)}</span>
    </div>
  `;
}

function weeklyCandidateSummary() {
  const slots = candidateTimeSlots();
  const candidateDays = weeklyCandidateDays.filter((day) =>
    candidateRows.some((candidate) => candidate.dateKey === day.dateKey),
  );
  return `
    <section class="weekly-summary-section">
      <div class="weekly-summary-head">
        <div>
          <h3>주간 후보표</h3>
          <p>7.13-7.17 업무일, ${timeCriteria.workStart}-${timeCriteria.workEnd} 범위에서 후보가 있는 시간만 압축해 보여줘요.</p>
        </div>
        <span>${candidateRows.length}개 후보</span>
      </div>

      <div class="weekly-summary-grid" style="--weekly-day-count: ${candidateDays.length}" aria-label="주간 후보표">
        <div class="weekly-summary-grid-head">
          <span class="weekly-time-head">시간</span>
          ${candidateDays
            .map(
              (day) => `
                <span>
                  <strong>${day.label}</strong>
                  <small>${day.weekday}</small>
                </span>
              `,
            )
            .join("")}
        </div>
        ${slots
          .map(
            (slot) => `
              <div class="weekly-summary-grid-row">
                <span class="weekly-time">${slot}</span>
                ${candidateDays
                  .map((day) => {
                    const candidate = findCandidate(day.dateKey, slot);
                    return candidate ? weeklySummaryBlock(candidate) : `<div class="weekly-summary-empty">-</div>`;
                  })
                  .join("")}
              </div>
            `,
          )
          .join("")}
      </div>

      <div class="weekly-summary-mobile" aria-label="날짜별 후보 요약">
        ${candidateDays
          .map((day) => {
            const dayCandidates = rankedCandidateRows().filter((candidate) => candidate.dateKey === day.dateKey);
            return `
              <div class="weekly-summary-day">
                <div class="weekly-day-head">
                  <strong>${day.label} (${day.weekday})</strong>
                  <span>${dayCandidates.length ? `${dayCandidates.length}개 후보` : "후보 없음"}</span>
                </div>
                ${
                  dayCandidates.length
                    ? dayCandidates.map((candidate) => weeklySummaryBlock(candidate)).join("")
                    : `<div class="weekly-summary-empty mobile-empty">후보 없음</div>`
                }
              </div>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function candidateRequestIssueList(candidate) {
  const issues = candidate.availability.issues.slice(0, 2);
  if (!issues.length) {
    return `<span class="candidate-card-note">주요 이슈 없음</span>`;
  }
  return `
    <ul class="candidate-issues request-issues">
      ${issues.map((issue) => candidateIssueRow(issue)).join("")}
    </ul>
  `;
}

function candidateRequestCard(candidate, index) {
  return `
    <article class="request-candidate-card is-selected">
      <div class="request-candidate-main">
        <div class="request-candidate-top">
          <span class="rank-label">TOP ${index + 1}</span>
          ${candidateScoreChip(candidate)}
        </div>
        <strong>${candidate.day} &nbsp; ${candidate.time}</strong>
        <div class="candidate-availability">
          ${candidateSummaryChip(candidate)}
        </div>
        <span class="candidate-buffer">${candidate.beforeBuffer} · ${candidate.afterBuffer}</span>
        ${candidateRequestIssueList(candidate)}
      </div>
    </article>
  `;
}

function candidateRequestList() {
  return `
    <section class="request-candidate-section">
      <div class="request-candidate-head">
        <h3>후보 상세</h3>
      </div>
      <div class="request-candidate-list">
        ${rankedCandidateRows().map((candidate, index) => candidateRequestCard(candidate, index)).join("")}
      </div>
    </section>
  `;
}

function weeklyCandidateView() {
  return `
    <div class="weekly-candidate-view">
      ${weeklyCandidateSummary()}
      ${candidateRequestList()}
    </div>
  `;
}

function selectedResponseOption(candidateId) {
  const selectedId = responseSelections[candidateId] || "any";
  return responseOptions.find((option) => option.id === selectedId) || responseOptions[3];
}

function responseOptionButton(candidate, option) {
  const selected = responseSelections[candidate.id] === option.id;
  return `
    <button
      class="response-option ${option.status} ${selected ? "is-selected" : ""}"
      type="button"
      data-candidate-response="${candidate.id}"
      data-response-option="${option.id}"
      aria-pressed="${selected}"
    >
      <span class="status-icon ${option.status}" aria-hidden="true">${option.mark}</span>
      <span>${option.text}</span>
      ${selected ? `<em>선택됨</em>` : ""}
    </button>
  `;
}

function compactBufferText(value) {
  return value.replace(/^앞\s*/, "").replace(/^뒤\s*/, "");
}

function stackedContextText(value) {
  const [primary, ...detail] = value.trim().split(/\s+/);
  if (!detail.length) return escapeHtml(primary);
  return `${escapeHtml(primary)}<br />${escapeHtml(detail.join(" "))}`;
}

function responseCandidateCard(candidate) {
  return `
    <article class="response-candidate-card">
      <div class="response-candidate-head">
        <div>
          <span>후보 시간</span>
          <strong>${candidate.day} &nbsp; ${candidate.time}</strong>
        </div>
        <span class="duration-pill">${meetingDetails.duration}</span>
      </div>

      <div class="response-calendar-context" aria-label="${candidate.day} ${candidate.time} 전후 일정">
        <div>
          <span>앞</span>
          <strong>${stackedContextText(compactBufferText(candidate.beforeBuffer))}</strong>
        </div>
        <div>
          <span>뒤</span>
          <strong>${stackedContextText(compactBufferText(candidate.afterBuffer))}</strong>
        </div>
        <div>
          <span>근접</span>
          <strong>${stackedContextText(candidate.nearby)}</strong>
        </div>
      </div>

      <div class="response-option-area">
        <div class="response-option-grid" role="group" aria-label="${candidate.day} ${candidate.time} 응답 선택">
          ${responseOptions.map((option) => responseOptionButton(candidate, option)).join("")}
        </div>
      </div>
    </article>
  `;
}

function responseContextCheck(id, label) {
  return `
    <label class="check-item">
      <input type="checkbox" data-context-check="${id}" ${responseContextChecks[id] ? "checked" : ""} />
      ${label}
    </label>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function recommendationReason(reason) {
  return reason;
}

function responseDetailsToggleHtml(targetRecipients, completedCount) {
  return `
    <details class="response-detail-toggle">
      <summary>
        <span>응답 자세히 보기</span>
        <em>${completedCount}/${targetRecipients.length}명 응답 · 마감 ${replyDeadline}</em>
      </summary>
      <div class="response-detail-body">
        <div class="wait-status-grid">
          <div class="wait-status-card is-done">
            <strong>발송 완료</strong>
            <span>${targetRecipients.length}명에게 이메일을 보냈어요</span>
          </div>
          <div class="wait-status-card is-done">
            <strong>${completedCount}/${targetRecipients.length}명 응답</strong>
            <span>응답이 도착했어요</span>
          </div>
          <div class="wait-status-card is-done">
            <strong>추천 결과 준비</strong>
            <span>도착한 응답으로 추천 시간을 찾았어요</span>
          </div>
        </div>

        <div class="panel-title-line response-detail-title">
          <p class="field-label">참석자별 응답</p>
          <span class="pill blue">필수 참석자 응답 완료</span>
        </div>

        <div class="people-list email-recipient-list response-detail-list">
          ${
            targetRecipients.length
              ? targetRecipients.map((person) => responseDetailRecipientRow(person)).join("")
              : `<div class="empty-row">응답을 기다릴 참석자가 없어요.</div>`
          }
        </div>
      </div>
    </details>
  `;
}

function recommendedFinalTime() {
  return recommendations[0];
}

function finalRecommendation() {
  return recommendations.find((item) => item.id === finalRecommendationId) || recommendedFinalTime();
}

function responseOptionById(optionId) {
  return responseOptions.find((option) => option.id === optionId) || responseOptions[3];
}

function recommendationVoteRows(candidateId) {
  const votes = recommendationVotes[candidateId] || [];
  return `
    <div class="recommend-vote-panel">
      <div class="recommend-vote-title">
        <strong>이 시간대 응답</strong>
        <span>${votes.length}/${recipients().length}명 응답</span>
      </div>
      <div class="recommend-vote-list">
        ${votes
          .map((vote) => {
            const person = directoryPeople.find((item) => item.id === vote.personId);
            const option = responseOptionById(vote.response);
            const attendeeRole = attendeeRoles.find((item) => item.id === vote.personId);
            const roleLabel = attendeeRole?.required ? "필수 참석자" : "선택 참석자";
            const roleClass = attendeeRole?.required ? "required" : "optional";
            if (!person) return "";
            return `
              <div class="recommend-vote-row">
                <span class="avatar">${person.initial}</span>
                <div>
                  <span class="vote-person-line">
                    <strong>${person.name}</strong>
                    <span class="vote-role ${roleClass}">${roleLabel}</span>
                  </span>
                  <span>${vote.note}</span>
                </div>
                <em class="${option.status}">
                  <span class="status-icon ${option.status}" aria-hidden="true">${option.mark}</span>
                  ${option.text}
                </em>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function recommendationCardsHtml() {
  return `
    <div class="recommend-list">
      ${recommendations
        .map(
          (item, index) => `
            <article class="recommend-card ${index === 0 ? "is-best" : ""} ${finalRecommendationId === item.id ? "is-chosen" : ""}">
              <div class="recommend-card-top">
                <div class="recommend-main">
                  <span class="pill ${item.tone}">${item.badge}</span>
                  <h3>${item.date} &nbsp; ${item.time}</h3>
                  <p>${recommendationReason(item.reason)}</p>
                </div>
                <div class="recommend-side">
                  <div class="match-level ${item.matchTone}">
                    <span>응답 일치도</span>
                    <strong>${item.matchLevel}</strong>
                  </div>
                </div>
              </div>
              <div class="recommend-actions">
                <button class="secondary-btn compact recommend-pick ${finalRecommendationId === item.id ? "is-selected" : ""}" type="button" data-final-pick="${item.id}">
                  ${finalRecommendationId === item.id ? "이 시간을 선택했어요" : "이 시간으로 정하기"}
                </button>
                <button class="recommend-toggle" type="button" data-toggle-recommendation="${item.id}" aria-expanded="${expandedRecommendationId === item.id}">
                  ${expandedRecommendationId === item.id ? "▴ 응답 접기" : "▾ 응답 자세히 보기"}
                </button>
              </div>
              ${expandedRecommendationId === item.id ? recommendationVoteRows(item.candidateId) : ""}
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function render(stepIndex, options = {}) {
  const nextIndex = Math.max(0, Math.min(screens.length - 1, Number(stepIndex)));
  if (!options.unlock && (nextIndex > maxUnlockedStep || !canNavigateToScreen(nextIndex))) return;
  if (options.unlock) {
    maxUnlockedStep = Math.max(maxUnlockedStep, nextIndex);
  }

  const enteringCalendarSync = nextIndex === 2 && currentStep !== 2;
  const enteringEmailConfirmFromCandidates = nextIndex === 3 && currentStep === 2;
  const leavingAttendeeStep = currentStep === 1 && nextIndex !== 1;

  if (nextIndex !== 2) {
    clearCalendarSyncTimers();
    if (!calendarSyncCompleted) {
      calendarSyncPhase = 0;
    }
  } else if (enteringCalendarSync && !options.keepCalendarSync) {
    clearCalendarSyncTimers();
    calendarSyncPhase = calendarSyncCompleted ? 2 : 0;
  }

  if (leavingAttendeeStep) {
    attendeeSearchTerm = "";
  }

  if (enteringEmailConfirmFromCandidates) {
    emailRequestSent = false;
    attendeeResponseSubmitted = false;
  }

  currentStep = nextIndex;
  const screen = screens[currentStep];

  if (numberNode) numberNode.textContent = screen.number;
  if (headingNode) headingNode.textContent = screen.title;
  if (subheadingNode) subheadingNode.textContent = screen.sub;
  panel.innerHTML = screen.html();
  setStepperState(screen.stepperIndex);
  setMenuState(screen.menuIndex);

  if (enteringCalendarSync && !options.keepCalendarSync && !calendarSyncCompleted) {
    startCalendarSync();
  }
}

function syncStepState(index) {
  if (calendarSyncPhase >= 2) return "is-complete";
  if (index < calendarSyncPhase) return "is-complete";
  if (index === calendarSyncPhase) return "is-active";
  return "";
}

function clearCalendarSyncTimers() {
  calendarSyncTimers.forEach((timer) => window.clearTimeout(timer));
  calendarSyncTimers = [];
  calendarSyncRunId += 1;
}

function resetCoordinationAfterAttendeeChange() {
  emailRequestSent = false;
  attendeeResponseSubmitted = false;
  calendarSyncCompleted = false;
  calendarSyncPhase = 0;
  clearCalendarSyncTimers();
  lockProgressAfter(1);
}

function startCalendarSync() {
  const runId = calendarSyncRunId;
  calendarSyncTimers = [
    window.setTimeout(() => advanceCalendarSync(1, runId), 1100),
    window.setTimeout(() => advanceCalendarSync(2, runId), 2300),
  ];
}

function advanceCalendarSync(nextPhase, runId) {
  if (currentStep !== 2 || runId !== calendarSyncRunId) return;
  calendarSyncPhase = nextPhase;
  if (nextPhase >= 2) {
    calendarSyncCompleted = true;
  }
  render(2, { keepCalendarSync: true });
}

function focusSearchInput() {
  const searchInput = document.querySelector("#attendeeSearch");
  if (searchInput) {
    searchInput.focus();
    searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
  }
}

function clearAttendeeSearch({ rerender = true } = {}) {
  if (!attendeeSearchTerm) return;
  attendeeSearchTerm = "";
  if (rerender && currentStep === 1) {
    render(currentStep);
  }
}

function canNavigateToScreen(targetIndex) {
  if (currentStep >= 8) {
    return targetIndex === currentStep;
  }

  if (attendeeResponseSubmitted || currentStep >= 6) {
    return targetIndex === currentStep;
  }

  if (emailRequestSent || currentStep >= 4) {
    return targetIndex === currentStep;
  }

  if (targetIndex === currentStep) {
    return true;
  }

  return targetIndex <= Math.min(maxUnlockedStep, 2);
}

function setStepperState(activeIndex) {
  stepButtons.forEach((button, index) => {
    const stepIndex = Number(button.dataset.step);
    const isDisabled = !canNavigateToScreen(stepIndex);
    const isLocked = isDisabled && index !== activeIndex;
    const isFinalStepper = activeIndex === stepButtons.length - 1;
    button.classList.toggle("is-active", index === activeIndex);
    button.classList.toggle("is-complete", index < activeIndex || (isFinalStepper && index === activeIndex));
    button.classList.toggle("is-locked", isLocked);
    button.disabled = isDisabled;
    button.setAttribute("aria-disabled", String(isDisabled));
  });
}

function setMenuState(activeIndex) {
  menuButtons.forEach((button, index) => {
    const stepIndex = Number(button.dataset.menuStep);
    const isDisabled = !canNavigateToScreen(stepIndex);
    const isLocked = isDisabled && index !== activeIndex;
    button.classList.toggle("is-active", index === activeIndex);
    button.disabled = isDisabled;
    button.setAttribute("aria-disabled", String(isDisabled));
    button.classList.toggle("is-locked", isLocked);
  });
}

function lockProgressAfter(stepIndex) {
  maxUnlockedStep = Math.min(maxUnlockedStep, stepIndex);
}

function celebrateIcon() {
  return `
    <div class="celebrate-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M5 21l4.2-11.5L16 16.3 5 21Z"></path>
        <path d="M13 5l1-2"></path>
        <path d="M17 8l2-1"></path>
        <path d="M18 13h3"></path>
        <path d="M10 3l1 3"></path>
        <path d="M15 11l3 3"></path>
      </svg>
    </div>
  `;
}

function renderParticipantComplete() {
  if (!panel) return;
  if (numberNode) numberNode.textContent = "완료";
  if (headingNode) headingNode.textContent = "응답 완료";
  if (subheadingNode) subheadingNode.textContent = "참석자가 후보 시간 응답을 제출했습니다.";
  panel.innerHTML = `
    <div class="response-layout">
      <div class="center-complete participant-complete">
        <div class="complete-inner">
          ${celebrateIcon()}
          <h2>응답을 보냈어요</h2>
          <p>주최자는 도착한 응답을 바탕으로<br />최적의 회의 시간을 확인하게 됩니다.</p>

          <div class="hint-box action-hint participant-final-note">
            <span class="info-icon" aria-hidden="true">i</span>
            <span>최종 시간이 정해지면 Google Calendar 초대와 확인 메일을 받아요.</span>
          </div>

          <div class="participant-next-action">
            <button class="secondary-btn participant-next-mail" type="button" data-participant-final-mail>최종 확인 페이지 보기</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderParticipantFinalMail() {
  if (!panel) return;
  if (numberNode) numberNode.textContent = "확정";
  if (headingNode) headingNode.textContent = "최종 일정 확인";
  if (subheadingNode) subheadingNode.textContent = "참석자가 확정된 회의 시간을 확인합니다.";
  panel.innerHTML = `
    <div class="response-layout">
      <div class="center-complete participant-complete">
        <div class="complete-inner">
          ${celebrateIcon()}
          <h2>회의 시간이 정해졌어요</h2>
          <p>Google Calendar 초대와 확인 메일이 도착했어요.</p>

          <div class="final-time participant-final-time">
            <strong>${finalRecommendation().date} ${finalRecommendation().time}</strong>
            <span>${meetingDetails.name} (${meetingDetails.duration})</span>
          </div>

          <div class="hint-box action-hint participant-final-note">
            <span class="info-icon" aria-hidden="true">i</span>
            <span>캘린더 초대에서 참석 여부를 확인할 수 있어요. 시간이 어려워졌다면 주최자에게 변경을 요청해주세요.</span>
          </div>

          <a class="primary-btn participant-calendar-link" href="https://calendar.google.com/calendar/u/0/r" target="_blank" rel="noreferrer">구글 캘린더에서 보기</a>
        </div>
      </div>
    </div>
  `;
}

stepButtons.forEach((button) => {
  button.addEventListener("click", () => {
    render(button.dataset.step);
  });
});

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    render(button.dataset.menuStep);
  });
});

panel.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    if (!attendeeRoles.some((role) => role.id === addButton.dataset.add)) {
      attendeeRoles.push({
        id: addButton.dataset.add,
        required: true,
      });
      resetCoordinationAfterAttendeeChange();
    }
    render(currentStep);
    focusSearchInput();
    return;
  }

  const searchRemoveButton = event.target.closest("[data-search-remove]");
  if (searchRemoveButton) {
    attendeeRoles = attendeeRoles.filter((role) => role.id !== searchRemoveButton.dataset.searchRemove);
    resetCoordinationAfterAttendeeChange();
    render(currentStep);
    focusSearchInput();
    return;
  }

  const searchRoleButton = event.target.closest("[data-search-role]");
  if (searchRoleButton) {
    const personId = searchRoleButton.dataset.searchPerson;
    const required = searchRoleButton.dataset.searchRole === "required";
    if (attendeeRoles.some((role) => role.id === personId)) {
      attendeeRoles = attendeeRoles.map((role) =>
        role.id === personId ? { ...role, required } : role,
      );
    } else {
      attendeeRoles.push({ id: personId, required });
    }
    resetCoordinationAfterAttendeeChange();
    render(currentStep);
    focusSearchInput();
    return;
  }

  const roleButton = event.target.closest("[data-role]");
  if (roleButton) {
    attendeeRoles = attendeeRoles.map((role) =>
      role.id === roleButton.dataset.person
        ? { ...role, required: roleButton.dataset.role === "required" }
        : role,
    );
    resetCoordinationAfterAttendeeChange();
    render(currentStep);
    return;
  }

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    attendeeRoles = attendeeRoles.filter((role) => role.id !== removeButton.dataset.remove);
    resetCoordinationAfterAttendeeChange();
    render(currentStep);
    return;
  }

  const responseButton = event.target.closest("[data-candidate-response]");
  if (responseButton) {
    responseSelections = {
      ...responseSelections,
      [responseButton.dataset.candidateResponse]: responseButton.dataset.responseOption,
    };
    render(currentStep);
    return;
  }

  if (event.target.closest("[data-toggle-participant-attendees]")) {
    participantAttendeesOpen = !participantAttendeesOpen;
    render(currentStep);
    return;
  }

  if (event.target.closest("[data-refresh-calendar]")) {
    clearCalendarSyncTimers();
    calendarSyncCompleted = false;
    calendarSyncPhase = 0;
    render(2, { keepCalendarSync: true, unlock: true });
    startCalendarSync();
    return;
  }

  if (event.target.closest("[data-send-request]")) {
    emailRequestSent = true;
    attendeeResponseSubmitted = false;
    finalRecommendationId = recommendedFinalTime().id;
    render(4, { unlock: true });
    return;
  }

  if (event.target.closest("[data-submit-response]")) {
    attendeeResponseSubmitted = true;
    if (isParticipantPage) {
      renderParticipantComplete();
      return;
    }
    render(4, { unlock: true });
    return;
  }

  if (event.target.closest("[data-participant-final-mail]")) {
    renderParticipantFinalMail();
    return;
  }

  const recommendationToggle = event.target.closest("[data-toggle-recommendation]");
  if (recommendationToggle) {
    const recommendationId = recommendationToggle.dataset.toggleRecommendation;
    expandedRecommendationId = expandedRecommendationId === recommendationId ? "" : recommendationId;
    render(currentStep);
    return;
  }

  const finalPickButton = event.target.closest("[data-final-pick]");
  if (finalPickButton) {
    finalRecommendationId = finalPickButton.dataset.finalPick;
    render(currentStep);
    return;
  }

  const finalizeButton = event.target.closest("[data-finalize-recommendation]");
  if (finalizeButton) {
    finalRecommendationId = finalizeButton.dataset.finalizeRecommendation;
    render(8, { unlock: true });
    return;
  }

  if (event.target.closest("[data-show-results]")) {
    attendeeResponseSubmitted = true;
    render(6, { unlock: true });
    return;
  }

  const nextButton = event.target.closest("[data-next]");
  if (nextButton) {
    render(nextButton.dataset.next, { unlock: true });
    return;
  }
});

panel.addEventListener("pointerdown", (event) => {
  isPointerInsideAttendeeSearch = Boolean(event.target.closest(".attendee-search-area"));
});

panel.addEventListener("focusout", (event) => {
  if (!event.target.closest(".attendee-search-area")) return;
  window.setTimeout(() => {
    if (isPointerInsideAttendeeSearch) {
      isPointerInsideAttendeeSearch = false;
      return;
    }
    const searchArea = document.querySelector(".attendee-search-area");
    if (searchArea && !searchArea.contains(document.activeElement)) {
      clearAttendeeSearch();
    }
  }, 0);
});

panel.addEventListener("input", (event) => {
  if (event.target.matches("[data-time-criteria]")) {
    timeCriteria = {
      ...timeCriteria,
      [event.target.dataset.timeCriteria]: event.target.value,
    };
    lockProgressAfter(0);
    setStepperState(screens[currentStep].stepperIndex);
    setMenuState(screens[currentStep].menuIndex);
    return;
  }

  if (event.target.matches("[data-context-check]")) {
    responseContextChecks = {
      ...responseContextChecks,
      [event.target.dataset.contextCheck]: event.target.checked,
    };
    return;
  }

  if (event.target.matches("#attendeeSearch")) {
    attendeeSearchTerm = event.target.value;
    const query = attendeeSearchTerm.trim().toLowerCase();
    const searchResults = document.querySelector("[data-search-results]");
    if (searchResults) {
      searchResults.hidden = !query;
      searchResults.innerHTML = query
        ? directorySearchResultsHtml(searchDirectoryPeople(query))
        : "";
    }
  }
});

window.addEventListener("blur", () => {
  if (currentStep === 1) {
    clearAttendeeSearch();
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && currentStep === 1) {
    clearAttendeeSearch({ rerender: false });
  }
});

render(isParticipantPage ? 5 : 0, { unlock: isParticipantPage });
