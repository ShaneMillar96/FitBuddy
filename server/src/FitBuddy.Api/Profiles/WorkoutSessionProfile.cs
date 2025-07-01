using AutoMapper;
using FitBuddy.Api.RequestModels.Sessions;
using FitBuddy.Api.ViewModels.Sessions;
using FitBuddy.Services.Dtos.Sessions;

namespace FitBuddy.Api.Profiles;

public class WorkoutSessionProfile : Profile
{
    public WorkoutSessionProfile()
    {
        // Request Model to DTO mappings
        CreateMap<CreateWorkoutSessionRequestModel, CreateWorkoutSessionDto>();
        
        CreateMap<CreateSessionExerciseProgressRequestModel, CreateSessionExerciseProgressDto>();
        
        CreateMap<CompleteWorkoutSessionRequestModel, CompleteWorkoutSessionDto>()
            .ForMember(dest => dest.SessionId, opt => opt.Ignore()); // Set in controller
        
        CreateMap<UpdateSessionExerciseProgressRequestModel, UpdateSessionExerciseProgressDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enum.Parse<ExerciseStatusDto>(src.Status)));
        
        CreateMap<UpdateSessionSetProgressRequestModel, UpdateSessionSetProgressDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enum.Parse<SetStatusDto>(src.Status)));

        // DTO to ViewModel mappings
        CreateMap<WorkoutSessionDto, WorkoutSessionViewModel>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<SessionExerciseProgressDto, SessionExerciseProgressViewModel>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<SessionSetProgressDto, SessionSetProgressViewModel>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
    }
}