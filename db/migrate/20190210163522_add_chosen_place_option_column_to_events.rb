class AddChosenPlaceOptionColumnToEvents < ActiveRecord::Migration[5.2]
  def change
    add_reference :events, :place_poll_option, foreign_key: true, null: true
  end
end
