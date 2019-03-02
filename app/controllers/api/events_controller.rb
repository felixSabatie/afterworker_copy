module Api
  class EventsController < ApplicationController
    before_action :authenticate_user

    def index
      render json: {events: current_user.events}, include: get_includes
    end

    def create
      event_params = params.require(:event).permit(
          :name,
          :is_open_to_dates,
          :is_open_to_places,
          :has_date_poll,
          :has_place_poll
      )

      event = Event.new(event_params)
      event.creator = current_user
      unless event.has_place_poll
        if params.has_key?(:place)
          place_params = params.require(:place).permit(:name, :latitude, :longitude)
          placePollOption = PlacePollOption.create(place_params)
          event.place_poll_options << placePollOption
          event.chosen_place = placePollOption

        else
          return render status: 422
        end
      end

      unless event.has_date_poll
        if params.has_key?(:date)
          date_params = params.require(:date).permit(:date)
          datePollOption = DatePollOption.create(date_params)
          event.date_poll_options << datePollOption
          event.chosen_date = datePollOption

        else
          return render status: 422
        end
      end

      if event.save
        render json: {event: event}, include: get_includes
      else
        render status: 422, json: event.errors.messages
      end
    end

    private

    def get_includes
      [{
           participants: {
               except: [:password_digest]
           }
       },
       :place_poll_options,
       :chosen_place,
       :date_poll_options,
       :chosen_date,
       :creator,
      ]
    end

  end
end
