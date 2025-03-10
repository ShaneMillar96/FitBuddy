"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkouts = void 0;
var react_query_1 = require("@tanstack/react-query");
var workout_1 = require("@/interfaces/workout");
var query_keys_1 = require("@/constants/query-keys");
var useWorkouts = function (_a) {
    var _b = _a.pageSize, pageSize = _b === void 0 ? 10 : _b, _c = _a.sortBy, sortBy = _c === void 0 ? "" : _c, _d = _a.sortDirection, sortDirection = _d === void 0 ? "asc" : _d, _e = _a.search, search = _e === void 0 ? "" : _e;
    return (0, react_query_1.useInfiniteQuery)({
        queryKey: [query_keys_1.QueryKeys.WORKOUTS, pageSize, sortBy, sortDirection, search],
        queryFn: function (_a) {
            var _b = _a.pageParam, pageParam = _b === void 0 ? 1 : _b;
            return (0, workout_1.getWorkouts)({ pageSize: pageSize, pageNumber: pageParam, sortBy: sortBy, sortDirection: sortDirection, search: search });
        },
        getNextPageParam: function (lastPage, allPages) {
            var totalFetched = allPages.reduce(function (acc, page) { return acc + page.data.length; }, 0);
            return totalFetched < lastPage.totalCount ? allPages.length + 1 : undefined;
        },
        keepPreviousData: true,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
};
exports.useWorkouts = useWorkouts;
