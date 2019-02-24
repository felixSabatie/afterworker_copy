module Api
  class EventsController < ApplicationController
    before_action :authenticate_user

    def index
      render json: {events: current_user.events}, include: get_includes
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
