module Api
  class EventsController < ApplicationController
    before_action :authenticate_user
    before_action :set_event, only: [:show]

    def index
      render json: {events: current_user.events}, include: get_includes_basic
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
        render json: {event: event}, include: get_includes_basic
      else
        render status: 422, json: event.errors.messages
      end
    end

    def show
      if @event === nil
        render status: 404
      else
        if @event.participants.any? {|user| user.id === current_user.id}
          render json: {event: @event}, include: get_includes_advanced
        else
          render status: 401
        end
      end
    end

    private

    def get_includes_basic
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

    def get_includes_advanced
      [{
           participants: {
               except: [:password_digest]
           }
       },
       {
           place_poll_options: {
               include: [{
                             voters: {
                                 except: [:password_digest]
                             }
                         }]
           }
       },
       :chosen_place,
       {
           date_poll_options: {
               include: [{
                             voters: {
                                 except: [:password_digest]
                             }
                         }]
           }
       },
       :chosen_date,
       :creator,
      ]
    end

    def set_event
      @event = Event.includes(:participants).find_by(event_hash: params[:hash])
    end

  end
end
